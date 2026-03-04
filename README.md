🍽️ SmartBite
AI-Powered Food Recommendation & Ordering Platform

SmartBite is a modern AI-driven food discovery and ordering platform that delivers personalized dish recommendations using Retrieval Augmented Generation (RAG) and vector search.

Instead of traditional keyword search, SmartBite allows users to interact with an AI assistant using natural language, which intelligently retrieves and recommends the most relevant dishes from the menu.

The system combines semantic embeddings, Supabase PostgreSQL vector search, and generative AI to create a personalized food discovery experience.

🌟 Key Highlights

• AI-powered food recommendation system
• Retrieval Augmented Generation (RAG) architecture
• Vector similarity search using pgvector
• Natural language AI assistant for menu discovery
• Personalized homepage recommendations
• Secure HTTP-only cookie authentication
• Supabase powered backend infrastructure
• Modern responsive UI with animated splash experience
• Fully modular FastAPI + Next.js + Supabase architecture

🧠 AI Recommendation System

SmartBite uses a RAG (Retrieval Augmented Generation) pipeline to generate intelligent food suggestions.

AI Workflow

Food menu items are converted into vector embeddings

Embeddings are stored in Supabase PostgreSQL with pgvector

User sends a natural language query

Query is converted into an embedding

Vector similarity search retrieves the most relevant dishes

Gemini AI generates a contextual recommendation and explanation

Example user query:

“I want something spicy and Indian for dinner”

AI response includes:

• Best matching dish
• Related dishes
• Personalized explanation

🎯 Core Features
🤖 SmartBite AI Assistant

Conversational AI interface for discovering food using natural language.

Capabilities:

• Understands conversational queries
• Performs semantic vector search
• Retrieves relevant dishes
• Generates AI-powered recommendation summaries

🏠 Personalized Homepage

After login, users see a dynamic personalized dashboard including:

Recommended For You

AI-driven recommendations based on interaction history.

Reorder Section

Quick access to previously ordered dishes.

Trending Dishes

Popular dishes across all users.

🍜 Smart Menu Exploration

Users can explore the menu using advanced filters.

Food Type

• Veg
• Non-Veg

Cuisine Filters

• Indian
• Asian
• Continental
• Healthy

Sorting Options

• Popularity
• Price

🛒 Smart Cart Experience

Features include:

• Add / remove items
• Smooth cart interactions
• Slide-to-order checkout
• Order success confirmation page

🔐 Secure Authentication System

SmartBite uses HTTP-only cookie based authentication.

Benefits:

• Prevents XSS token theft
• Secure server-side session handling
• Protected API endpoints

Registration Validation

Live password validation includes:

• Minimum 8 characters
• 1 uppercase letter
• 1 lowercase letter
• 1 special character
• Password confirmation verification

🎨 Premium User Experience

SmartBite provides a modern UI including:

• Animated splash screen
• Smooth transitions
• Responsive layout
• Clean minimal design

🏗️ Tech Stack
Frontend

• Next.js (App Router)
• TypeScript
• TailwindCSS
• Framer Motion

Backend

• FastAPI
• Python

Database

• Supabase PostgreSQL

Vector Search

• pgvector

Used for storing food embeddings.

AI / ML

• Gemini API
• Gemini Embedding Model
• Retrieval Augmented Generation (RAG)

Storage

• Supabase Storage (S3 compatible)

Used for:

• Food images
• Media assets

📂 Project Structure
SMARTBITE
│
├── backend
│   │
│   ├── app
│   │   ├── api
│   │   │   ├── admin_food.py
│   │   │   ├── assistant.py
│   │   │   ├── auth.py
│   │   │   ├── cart.py
│   │   │   ├── food.py
│   │   │   ├── order.py
│   │   │   ├── search.py
│   │   │   └── user.py
│   │
│   │   ├── core
│   │   │   ├── dependencies.py
│   │   │   └── security.py
│   │
│   │   ├── models
│   │   ├── schemas
│   │   └── services
│   │
│   ├── seed_foods.py
│   ├── seed_embeddings.py
│   ├── seed_interactions.py
│   └── requirements.txt
│
├── frontend
│
│   ├── app
│   │   ├── ai
│   │   ├── login
│   │   ├── register
│   │   ├── menu
│   │   ├── orders
│   │   └── order-success
│
│   ├── components
│   │   ├── ai
│   │   ├── cart
│   │   ├── food
│   │   ├── layout
│   │   ├── sections
│   │   └── splash
│
│   ├── context
│   ├── lib
│   ├── types
│   └── public
│
└── README.md
⚙️ Environment Variables
Backend .env
GEMINI_API_KEY=
SUPABASE_URL=
SUPABASE_STORAGE_BUCKET=
Frontend .env.local
NEXT_PUBLIC_API_URL=
🧬 Initial Data Setup (Required)

Before using SmartBite, the database must be seeded with menu data and embeddings.

1️⃣ Seed Food Menu
python seed_foods.py

This will:

• Populate the database with food menu items
• Store dish metadata such as name, price, and cuisine

2️⃣ Generate AI Embeddings
python seed_embeddings.py

This script:

• Converts food descriptions into embeddings
• Stores them in pgvector

This enables semantic search and AI recommendations.

3️⃣ Seed User Interaction Data (Optional)
python seed_interactions.py

Used to simulate interaction history for:

• recommendations
• reorder suggestions

▶️ Running the Project Locally
Clone Repository
git clone https://github.com/yourusername/smartbite.git
cd smartbite
Backend Setup
cd backend

python -m venv venv
venv\Scripts\activate

pip install -r requirements.txt

Start backend server:

uvicorn app.main:app --reload

Backend runs on:

http://localhost:8000
Frontend Setup
cd frontend
npm install
npm run dev

Frontend runs on:

http://localhost:3000
🔮 Future Improvements

Planned enhancements include:

💳 Payment Gateway Integration

Integrate real-time payment systems such as Razorpay or Stripe.

📦 Live Order Tracking

Use WebSockets for real-time order tracking.

📍 Location Based Recommendations

Recommend dishes based on:

• user location
• nearby restaurants
• local trends

🎟️ Coupons & Discounts

Dynamic pricing and promotional offers.

📢 Advertisement System

Monetization through sponsored food placements.

🧠 Behavioral AI Recommendations

Improve recommendations using user behavior analytics.

👨‍💻 Author

Sai Satya Vardhan
Computer Science Engineering
Mahindra University

⭐ Support

If you found this project interesting, consider giving it a ⭐ on GitHub.