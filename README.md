CodeUp


Welcome to CodeUp - a next-level coding platform designed to make learning and mastering programming fun, interactive, and accessible for students in India and beyond! Whether you're just starting out or leveling up your skills, CodeUp combines AI-powered tools, Hinglish explanations, and collaborative workspaces to supercharge your coding journey.

What is CodeUp?
CodeUp is a web application built with React that empowers students to:

Understand code with AI-driven Hinglish explanations and speech.
Track their progress with an interactive dashboard.
Collaborate seamlessly in workspaces.
Attempt tests and get insightful feedback.
Our mission? To help you "Code Up" your skills, one step at a time, with a desi twist!

Features
For Everyone (Starter Plan)
AI Code Explainer: Get beginner-friendly code explanations in Hinglish, powered by Gemini API (limited to 10/day).
Hinglish Speech: Hear explanations in Hindi using Web Speech API (basic speed).
Workspace Basics: Create 1 workspace and join up to 2 invited ones for collaboration.
Test Submissions: Submit coding tests and receive standard feedback.
Performance Chart: Visualize your test scores with a simple bar chart.
For Pro Coders (Pro Plan)
Unlimited AI Explanations: No limits on code explanations - analyze as much as you want!
Custom Speech Speed: Adjust the Hinglish speech rate (e.g., 1.5x faster) for quicker learning.
Unlimited Workspaces: Create and join as many workspaces as you need.
Advanced Test Insights: Detailed feedback on test submissions to sharpen your skills.
Interactive Dashboard: Enhanced stats and a personalized roadmap to guide your journey.
Tech Stack
Frontend: React, Tailwind CSS, Chart.js
Backend: Node.js (assumed), Axios for API calls
APIs: Gemini API (AI explanations), Web Speech API (text-to-speech)
Services: Workspace management, test submission system
Tools: Vite (build tool), GitHub for version control
Getting Started
Prerequisites
Node.js (v16 or higher)
npm or yarn
A Gemini API key (for AI explanations)
Installation
Clone the Repository:
bash

Collapse

Wrap


cd codeup
Install Dependencies:
bash

Collapse

Wrap

Copy
npm install
Set Up Environment Variables: Create a .env file in the root directory and add:
env

Collapse

Wrap

Copy
VITE_BACKEND_URL=your-backend-url
VITE_GEMINI_API_KEY=your-gemini-api-key
Run the App:
bash

Collapse

Wrap

Copy
npm run dev
Open http://localhost:5173 in your browser.
Usage
Code Explainer: Paste your code in the editor, click the floating play button, and hear the Hinglish explanation.
Dashboard: Log in to view your test stats, workspaces, and roadmap.
Tests: Enter a unique test code to start coding challenges.
Project Structure
text

Collapse

Wrap

Copy
codeup/
├── src/
│   ├── assets/              # Images and static files (e.g., logo, video placeholder)
│   ├── components/          # Reusable components (e.g., AIExplain, SubmitTest)
│   ├── context/             # AuthContext for user management
│   ├── services/            # API services (e.g., geminiService, workspaceService)
│   └── pages/               # Page components (e.g., StudentDashboard)
├── public/                  # Fallback images (e.g., avatar, animation)
└── README.md                # This file


Contributing
We’d love for you to contribute to CodeUp! Here’s how:

Fork the repo.
Create a new branch (git checkout -b feature/your-feature).
Commit your changes (git commit -m "Add your feature").
Push to your branch (git push origin feature/your-feature).
Open a Pull Request.
Check out our  for more details.

Roadmap
Add real-time collaboration in workspaces.
Integrate more AI tools for code debugging.
Expand Hinglish speech with regional accents.
Offer downloadable certificates for test completions.
License
This project is licensed under the MIT License - see the  file for details.


Happy Coding with CodeUp! 🚀
