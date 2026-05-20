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
