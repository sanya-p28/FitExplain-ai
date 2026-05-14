# 🚀 FitExplain-AI

**Your Body, Explained by AI.**

FitExplain-AI is a high-performance, full-stack fitness platform that leverages Google's Gemini AI to transform raw workout data into conversational, actionable insights. Unlike traditional fitness trackers, FitExplain focuses on the "why," providing users with deep context regarding their training and physiological progress.

## ✨ Core Features

* **🤖 AI-Powered Routine Generation:** Uses Gemini AI to create custom fitness plans that explain the scientific reasoning behind every exercise selection.
* **🔐 Secure Multi-Tenant Auth:** A robust authentication flow powered by Clerk, featuring protected routes and persistent user sessions.
* **📊 Real-Time Data Sync:** Instant database persistence and state synchronization via Convex, ensuring a seamless experience across all devices.
* **⚡ Next.js 15 Performance:** Built on the latest App Router architecture for lightning-fast server-side rendering and optimized SEO.
* **📱 Responsive Cyber-Terminal UI:** A unique, high-contrast interface built with Tailwind CSS, designed for both desktop analysis and mobile gym tracking.

## 🛠️ Technical Stack

* **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
* **Backend/Database:** [Convex](https://www.convex.dev/)
* **Authentication:** [Clerk](https://clerk.com/)
* **AI Engine:** [Google Gemini API](https://ai.google.dev/)
* **Styling:** Tailwind CSS + Framer Motion
* **Deployment:** Vercel

## 🏗️ Local Setup Instructions

### 1. Clone & Install

```bash
git clone https://github.com/sanya-p28/FitExplain-ai.git
cd FitExplain-ai
npm install

```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_pub_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Convex Database
CONVEX_DEPLOYMENT=your_convex_deployment_url
NEXT_PUBLIC_CONVEX_URL=your_convex_public_url

# AI API
GEMINI_API_KEY=your_gemini_api_key

```

### 3. Run Development Servers

You will need two terminal windows open:

```bash
# Terminal 1: Next.js Frontend
npm run dev

# Terminal 2: Convex Backend
npx convex dev

```

## 🛡️ Engineering Milestones & Solutions

During the development of FitExplain-AI, I solved several critical full-stack challenges:

* **Cross-Platform Directory Architecture:** Successfully resolved Windows-to-Linux pathing conflicts by restructuring nested auth directories (`sign-in/[[...sign-in]]`), ensuring compatibility with Vercel's production build servers.
* **Unified TypeScript Interface:** Engineered a custom `ProfileHeaderProps` interface to bridge the gap between Clerk's Client-side (`UserResource`) and Server-side (`User`) objects, achieving 100% type safety across the application.
* **Middleware Optimization:** Configured advanced Clerk middleware logic to handle complex routing for dynamic AI-generated paths while preventing unauthorized API access.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](https://www.google.com/search?q=LICENSE) file for details.

---

**Live Deployment:** [fit-explain-ai.vercel.app](https://www.google.com/search?q=https://fit-explain-ai.vercel.app/)
