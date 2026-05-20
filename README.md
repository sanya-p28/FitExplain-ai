# 🚀 FitExplain-AI

**Your Body, Explained by AI — Built with Voice-First Orchestration.**

FitExplain-AI is a high-performance, full-stack fitness ecosystem that leverages conversational AI and deep learning models to transform raw human biometric inputs into structured, actionable training routines. Moving beyond traditional form-based fitness trackers, FitExplain features an immersive voice intake pipeline that uncovers the "why" behind your training, offering explicit, scientific context for every health metric.

---

## ✨ Core Features

* **🎙️ Voice-First AI Onboarding:** Powered by Vapi.ai, users experience an interactive, multi-node voice conversation that dynamically captures 8 core biometric parameters (Age, Weight, Height, Injuries, etc.) naturally without tedious input forms.
* **🧠 Explainable AI (XAI) Generation:** Utilizes Google Gemini 1.5 Flash to process conversational transcripts through a "Reasoning-over-Data" engine, implementing clinical calculations like the Mifflin-St Jeor formula for basal metabolic baselines.
* **🔐 Secure Multi-Tenant Auth:** Integrated with Clerk and secured via Svix cryptographic webhook signatures to establish a protected, authenticated state across cloud protocols.
* **📊 Reactive WebSocket Data Sync:** Driven by a live Convex backend, data synchronization occurs instantly via persistent WebSockets, refreshing the user dashboard the exact millisecond an AI generation completes.
* **⚡ Next.js 15 Powerhouse:** Optimized on the modern Next.js 15 App Router architecture for seamless server-side rendering, type-safe API routing, and instant client hydration.
* **📱 Responsive Cyber-Terminal UI:** A unique, high-contrast, dark-mode first design constructed with Tailwind CSS and Framer Motion, optimized for real-time data scannability inside the gym.

---

## 🏗️ Architectural Pipeline & The "Triple-Cloud Handshake"

FitExplain-AI operates on an event-driven microservices architecture built on a zero-latency feedback loop:


```

[ User Voice ] ──> ( Vapi.ai Agent ) ──[ Cryptographic Webhook ]──> ( Convex Backend )
│
[ UI Dashboard ] <──[ Persistent WebSockets ]── ( Gemini 1.5 Flash ) <───┘

```

1. **The Voice Intake Phase:** The user triggers a call managed by Vapi.ai. A structural node tree handles conversation flow, validating user metrics dynamically before passing a payload to a system tool.
2. **The Handshake & Persistence:** Upon completion, Vapi triggers an encrypted webhook verified securely via **Svix** into Convex, instantly writing the telemetry data into the `plans` schema.
3. **The Generation & Live Mutate:** Convex fires a serverless action passing constraints to **Gemini 1.5 Flash**. The generated JSON object is validated, and Convex uses WebSockets to instantly push updates to the Next.js client without requiring a webpage reload.

---

## 🛠️ Technical Stack

* **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
* **Voice Agent Core:** [Vapi.ai](https://vapi.ai/) (Voice AI Orchestration)
* **Backend / Real-time DB:** [Convex](https://www.convex.dev/)
* **Authentication:** [Clerk](https://clerk.com/)
* **Webhook Security:** [Svix](https://www.svix.com/)
* **AI Engine:** [Google Gemini API](https://ai.google.dev/) (Gemini 1.5 Flash)
* **Styling:** Tailwind CSS + Framer Motion
* **Deployment:** Vercel

---

## 🏗️ Local Setup Instructions

### 1. Clone & Install

```bash
git clone [https://github.com/sanya-p28/FitExplain-ai.git](https://github.com/sanya-p28/FitExplain-ai.git)
cd FitExplain-ai
npm install

```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Clerk Authentication Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_pub_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Convex Database Configuration
CONVEX_DEPLOYMENT=your_convex_deployment_url
NEXT_PUBLIC_CONVEX_URL=your_convex_public_url

# Voice Engine Config
VAPI_API_KEY=your_vapi_api_key
VAPI_ASSISTANT_ID=your_vapi_assistant_id
SVIX_WEBHOOK_SECRET=your_svix_secret_for_vapi_clerk

# AI API Engine
GEMINI_API_KEY=your_gemini_api_key

```

### 3. Run Development Servers

You will need two terminal windows running concurrently:

```bash
# Terminal 1: Next.js Frontend UI Development
npm run dev

# Terminal 2: Convex Backend & Database Watcher
npx convex dev

```

---

## 🛡️ Engineering Milestones & Edge-Case Solutions

During development, the system was optimized to overcome several full-stack distributed system barriers:

* **Webhook Tamper Protection:** Implemented rigorous cryptographic validation routines using the `svix` package to parse multi-tenant payloads incoming from both Vapi.ai and Clerk webhooks, ensuring strict rejection of forged server requests.
* **Structured AI Data Enforcement:** Mitigated the risk of LLM hallucinations throwing syntax errors on the client UI by packing custom validation middleware (`validateWorkoutPlan` and `validateDietPlan`) to forcefully coerce Gemini's generative returns into rigid integer formatting.
* **Unified Auth Typing Interface:** Engineered a singular `ProfileHeaderProps` TypeScript adapter to bridge discrepancies between client-side (`UserResource`) and server-side (`User`) objects exposed by Clerk, guaranteeing strict build-time type verification.
* **Cross-Platform Directory Architecture:** Resolved production build failures on Linux environments (Vercel) stemming from case-sensitive path compilation of dynamic catch-all route structures (`sign-in/[[...sign-in]]`) configured on local Windows systems.

---

## 📄 License

This project is licensed under the MIT License.

**Live Project Instance:** [fit-explain-ai.vercel.app](https://www.google.com/search?q=https://fit-explain-ai.vercel.app/)
