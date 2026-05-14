🚀 FitExplain-AI
FitExplain-AI is a full-stack fitness platform that uses Google's Gemini AI to break down complex workout data into actionable, easy-to-understand insights. Built with Next.js 15, Clerk, and Convex, it bridges the gap between raw biometrics and personalized coaching.

🛠️ Technical Stack
Framework: Next.js 15 (App Router)

Database & Backend: Convex (Real-time sync)

Auth: Clerk (Serverless Authentication)

AI Engine: Google Gemini API

Styling: Tailwind CSS + Framer Motion

Deployment: Vercel

🏗️ Local Setup Instructions
To get this project running on your local machine, follow these steps:

1. Clone the repository
Bash
git clone https://github.com/sanya-p28/FitExplain-ai.git
cd FitExplain-ai
2. Install dependencies
Bash
npm install
3. Configure Environment Variables
Create a .env.local file in the root directory and add the following keys from your Clerk and Convex dashboards:

Code snippet
# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_secret

# Convex Database
CONVEX_DEPLOYMENT=your_deployment_url
NEXT_PUBLIC_CONVEX_URL=your_public_url

# AI API
GEMINI_API_KEY=your_gemini_key
4. Run the development server
Bash
# Start the Next.js dev server
npm run dev

# In a separate terminal, start the Convex backend
npx convex dev
🛡️ Key Technical Solutions
Cross-Platform Directory Sync: Resolved Windows-to-Linux pathing issues by restructuring nested route directories for Vercel compatibility.

Unified Type System: Implemented custom TypeScript interfaces to bridge Clerk's Client (UserResource) and Server (User) objects in shared UI components.

Zero-Latency Auth: Leveraged Clerk's middleware to protect sensitive routes (/profile, /generate-program) while maintaining fast initial page loads.
