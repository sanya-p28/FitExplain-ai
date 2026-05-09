import { httpRouter } from "convex/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";
import { api } from "./_generated/api";
import { httpAction } from "./_generated/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const http = httpRouter();

// Initialize genAI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error("Missing CLERK_WEBHOOK_SECRET environment variable");
    }

    const svix_id = request.headers.get("svix-id");
    const svix_signature = request.headers.get("svix-signature");
    const svix_timestamp = request.headers.get("svix-timestamp");

    if (!svix_id || !svix_signature || !svix_timestamp) {
      return new Response("No svix headers found", { status: 400 });
    }

    const payload = await request.json();
    const body = JSON.stringify(payload);

    const wh = new Webhook(webhookSecret);
    let evt: WebhookEvent;

    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
    } catch (err) {
      console.error("Error verifying webhook:", err);
      return new Response("Error occurred", { status: 400 });
    }

    const eventType = evt.type;

    if (eventType === "user.created") {
      const { id, first_name, last_name, image_url, email_addresses } = evt.data;
      const email = email_addresses[0].email_address;
      const name = `${first_name || ""} ${last_name || ""}`.trim();

      try {
        await ctx.runMutation(api.users.syncUser, {
          email,
          name,
          image: image_url,
          clerkId: id,
        });
      } catch (error) {
        console.log("Error creating user:", error);
        return new Response("Error creating user", { status: 500 });
      }
    }

    if (eventType === "user.updated") {
      const { id, email_addresses, first_name, last_name, image_url } = evt.data;
      const email = email_addresses[0].email_address;
      const name = `${first_name || ""} ${last_name || ""}`.trim();

      try {
        await ctx.runMutation(api.users.updateUser, {
          clerkId: id,
          email,
          name,
          image: image_url,
        });
      } catch (error) {
        console.log("Error updating user:", error);
        return new Response("Error updating user", { status: 500 });
      }
    }

    return new Response("Webhooks processed successfully", { status: 200 });
  }),
});

// Helpers to ensure data fits your Convex schema
function validateWorkoutPlan(plan: any) {
  return {
    exercises: (plan.exercises || []).map((exercise: any) => ({
      day: exercise.day || "General",
      routines: (exercise.routines || []).map((routine: any) => ({
        name: routine.name || "Exercise",
        sets: typeof routine.sets === "number" ? routine.sets : parseInt(routine.sets) || 3,
        reps: typeof routine.reps === "number" ? routine.reps : parseInt(routine.reps) || 10,
        description: routine.description || "",
        exercises: routine.exercises || [],
      })),
    })),
  };
}

function validateDietPlan(plan: any) {
  return {
    dailyCalories: typeof plan.dailyCalories === "number" ? plan.dailyCalories : parseInt(plan.dailyCalories) || 2000,
    meals: (plan.meals || []).map((meal: any) => ({
      name: meal.name || "Meal",
      foods: meal.foods || [],
    })),
  };
}

/**
 * Removes Markdown code blocks like ```json and 
``` from AI responses.
 */
function parseAIResponse(text: string) {
  const jsonString = text.replace(/```json|```/gi, "").trim();
  return JSON.parse(jsonString);
}

http.route({
  path: "/vapi/generate-program",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const payload = await request.json();
      
      if (payload.message?.type !== "end-of-call-report") {
        return new Response(JSON.stringify({ status: "ignored" }), { status: 200 });
      }

      const analysis = payload.message.analysis;
      const structuredData = analysis?.structuredData;

      // Extract fitness data safely from the Vapi analysis
      let data = structuredData;
      if (structuredData && typeof structuredData === 'object') {
          const keys = Object.keys(structuredData);
          if (keys.length === 1 && structuredData[keys[0]].result) {
              data = structuredData[keys[0]].result;
          } else if (structuredData.result) {
              data = structuredData.result;
          }
      }
      
      if (!data || !data.user_id) {
        return new Response(JSON.stringify({ status: "waiting_for_analysis" }), { status: 200 });
      }

      const weightClean = typeof data.weight === 'number' ? data.weight : parseInt(data.weight) || 70;
      const goalClean = data.fitness_goal || "Fitness";
      const user_id = data.user_id;

      /**
       * CRITICAL FIX: Using the explicit 'models/' prefix to resolve 404 versioning error.
       */
      // Replace your current line 162 with this:
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }, { apiVersion: 'v1' });

      const generationConfig = {
        temperature: 0.4,
        topP: 0.9,
      };

      // 1. Workout generation
      const workoutPrompt = `Generate a JSON workout plan for: Goal: ${goalClean}, Days: ${data.workout_days || 3}. 
      IMPORTANT: Return ONLY raw JSON code. No conversation.
      Structure: {"exercises": [{"day": "Monday", "routines": [{"name": "Chest Press", "sets": 3, "reps": 12, "description": "Keep back flat", "exercises": ["Pushups"]}]}]}`;

      const workoutResult = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: workoutPrompt }] }],
        generationConfig
      });
      let workoutPlan = parseAIResponse(workoutResult.response.text());
      workoutPlan = validateWorkoutPlan(workoutPlan);

      // 2. Diet generation
      const dietPrompt = `Generate a JSON diet plan for: Goal: ${goalClean}, Weight: ${weightClean}kg. 
      IMPORTANT: Return ONLY raw JSON code. No conversation.
      Structure: {"dailyCalories": 2200, "meals": [{"name": "Breakfast", "foods": ["Oatmeal", "Eggs"]}]}`;

      const dietResult = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: dietPrompt }] }],
        generationConfig
      });
      let dietPlan = parseAIResponse(dietResult.response.text());
      dietPlan = validateDietPlan(dietPlan);

      // 3. Save to database using your 'plans' mutation
      const planId = await ctx.runMutation(api.plans.createPlan, {
        userId: user_id,
        dietPlan,
        isActive: true,
        workoutPlan,
        name: `${goalClean} Plan`,
      });

      return new Response(JSON.stringify({ success: true, planId }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });

    } catch (error) {
      console.error("Critical error in program generation:", error);
      return new Response(JSON.stringify({ success: false, error: String(error) }), {
        status: 500,
      });
    }
  }),
});

export default http;