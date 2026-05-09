"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import ProfileHeader from "@/components/ProfileHeader";
import NoFitnessPlan from "@/components/NoFitnessPlan";
import CornerElements from "@/components/CornerElements";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppleIcon, CalendarIcon, DumbbellIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ProfilePage = () => {
  const { user, isLoaded } = useUser();
  const userId = user?.id;

  const allPlans = useQuery(
    api.plans.getUserPlans, 
    userId ? { userId } : "skip"
  );

  const [selectedPlanId, setSelectedPlanId] = useState<null | string>(null);

  if (!isLoaded || allPlans === undefined) {
    return (
      <section className="relative z-10 pt-12 pb-32 grow container mx-auto px-4 flex items-center justify-center">
        <div className="font-mono text-primary animate-pulse">
          INITIALIZING_SYSTEM...
        </div>
      </section>
    );
  }

  const activePlan = allPlans?.find((plan) => plan.isActive);
  const currentPlan = selectedPlanId
    ? allPlans?.find((plan) => plan._id === selectedPlanId)
    : activePlan;

  return (
    <section className="relative z-10 pt-12 pb-32 grow container mx-auto px-4 w-full">
      <ProfileHeader user={user} />

      {allPlans && allPlans.length > 0 ? (
        <div className="flex flex-col gap-8 w-full">
          {/* PLAN SELECTOR BAR */}
          <div className="relative backdrop-blur-sm border border-border p-6 bg-background/30 rounded-lg w-full">
            <CornerElements />
            <div className="flex items-center justify-between mb-4 w-full">
              <h2 className="text-xl font-bold tracking-tight uppercase">
                <span className="text-primary">Your</span>{" "}
                <span className="text-foreground">Fitness Plans</span>
              </h2>
              <div className="font-mono text-xs text-muted-foreground">
                RECORDS_FOUND: {allPlans.length}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {allPlans.map((plan) => (
                <Button
                  key={plan._id}
                  onClick={() => setSelectedPlanId(plan._id)}
                  variant="outline"
                  className={`transition-all duration-300 ${
                    (selectedPlanId === plan._id) || (!selectedPlanId && plan.isActive)
                      ? "bg-primary/20 text-primary border-primary"
                      : "bg-transparent border-border text-muted-foreground"
                  }`}
                >
                  {plan.name}
                  {plan.isActive && <span className="ml-2 text-[10px] text-green-500 font-bold">ACTIVE</span>}
                </Button>
              ))}
            </div>
          </div>

          {/* MAIN DATA VIEW */}
          {currentPlan && (
            <div className="w-full relative backdrop-blur-sm border border-border rounded-xl p-4 md:p-8 bg-background/20">
              <CornerElements />
              
              <div className="mb-6 border-b border-border pb-4">
                 <h3 className="text-lg font-bold uppercase tracking-widest text-primary">
                    ACTIVE_PLAN: {currentPlan.name}
                 </h3>
              </div>

              {/* Ensure the Tabs component itself is set to w-full and doesn't have flex layout */}
              <Tabs defaultValue="workout" className="w-full flex flex-col">
                <TabsList className="grid grid-cols-2 w-full mb-8 h-14 bg-slate-950/50 border border-border p-1">
                  <TabsTrigger value="workout" className="font-bold data-[state=active]:bg-primary/10">
                    <DumbbellIcon className="mr-2 h-4 w-4" /> WORKOUT_SEQUENCE
                  </TabsTrigger>
                  <TabsTrigger value="diet" className="font-bold data-[state=active]:bg-primary/10">
                    <AppleIcon className="mr-2 h-4 w-4" /> NUTRITION_LOG
                  </TabsTrigger>
                </TabsList>

                {/* --- WORKOUT SECTION --- */}
                <TabsContent value="workout" className="w-full mt-0 focus-visible:ring-0">
                  <div className="flex flex-col gap-6 w-full">
                    {/* Schedule Header */}
                    <div className="flex items-center gap-3 p-4 border border-primary/20 bg-primary/5 rounded-md w-full">
                      <CalendarIcon className="h-5 w-5 text-primary" />
                      <span className="font-mono text-sm uppercase tracking-widest">
                        SCHEDULE: {(currentPlan.workoutPlan as any).schedule?.join(", ") || "DYNAMIC_ROUTINE"}
                      </span>
                    </div>

                    {/* Full Width Accordion */}
                    <Accordion type="multiple" className="w-full flex flex-col gap-4">
                      {currentPlan.workoutPlan.exercises.map((exerciseDay, idx) => (
                        <AccordionItem 
                          key={idx} 
                          value={exerciseDay.day} 
                          className="border border-border/60 rounded-lg bg-background/40 w-full"
                        >
                          <AccordionTrigger className="px-6 py-5 hover:no-underline font-mono w-full">
                            <div className="flex justify-between w-full items-center pr-6">
                              <span className="text-lg font-bold text-primary">{exerciseDay.day}</span>
                              <span className="text-xs text-muted-foreground bg-border/40 px-2 py-1 rounded">
                                {exerciseDay.routines.length} EXERCISES
                              </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-6 pb-6 pt-2 w-full">
                            <div className="grid grid-cols-1 gap-4 w-full">
                              {exerciseDay.routines.map((routine, rIdx) => (
                                <div key={rIdx} className="flex flex-col md:flex-row md:items-center justify-between p-5 rounded-md border border-border/30 bg-slate-900/60 gap-4 w-full">
                                  <div className="space-y-1">
                                    <h4 className="text-md font-bold text-foreground uppercase tracking-tight">{routine.name}</h4>
                                    <p className="text-xs text-muted-foreground">{routine.description || "Maintain controlled movement throughout the set."}</p>
                                  </div>
                                  <div className="flex gap-4">
                                    <div className="flex flex-col items-center justify-center min-w-[80px] py-2 border border-primary/20 rounded bg-primary/5">
                                      <span className="text-[10px] text-primary uppercase font-bold">Sets</span>
                                      <span className="text-xl font-mono font-bold">{routine.sets}</span>
                                    </div>
                                    <div className="flex flex-col items-center justify-center min-w-[80px] py-2 border border-secondary/20 rounded bg-secondary/5">
                                      <span className="text-[10px] text-secondary uppercase font-bold">Reps</span>
                                      <span className="text-xl font-mono font-bold">{routine.reps}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                </TabsContent>

                {/* --- DIET SECTION --- */}
                <TabsContent value="diet" className="w-full mt-0 focus-visible:ring-0">
                  <div className="flex flex-col gap-8 w-full">
                    <div className="flex justify-between items-center p-6 border border-primary/20 bg-primary/5 rounded-lg w-full">
                      <span className="font-mono text-lg font-bold uppercase">DAILY_CALORIC_TARGET</span>
                      <span className="font-mono text-4xl text-primary font-black">
                        {currentPlan.dietPlan.dailyCalories} <span className="text-sm font-normal">KCAL</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                      {currentPlan.dietPlan.meals.map((meal, mIdx) => (
                        <div key={mIdx} className="border border-border/50 rounded-xl p-6 bg-background/40 w-full">
                          <h4 className="font-mono text-sm text-primary font-black uppercase mb-4 tracking-widest">{meal.name}</h4>
                          <ul className="space-y-3">
                            {meal.foods.map((food, fIdx) => (
                              <li key={fIdx} className="text-sm text-muted-foreground flex items-start gap-3">
                                <span className="text-primary/40 font-mono text-xs">{String(fIdx + 1).padStart(2, '0')}</span>
                                {food}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      ) : (
        <NoFitnessPlan />
      )}
    </section>
  );
};

export default ProfilePage;