# 🎬 NextFrame AI

> **An AI-powered YouTube Creator Suite** — 16 intelligent tools to grow your channel using real data, powered by Groq AI (Llama 3.1).

🌐 **Live App:** https://nextframe-ai.vercel.app  
⚙️ **API:** https://nextframe-ai-backend.onrender.com

---

## 🚀 Features

| Tool | Description |
|---|---|
| 📊 **Dashboard** | Channel stats, subscriber count, views |
| 🔮 **Video Predictor** | Predict success score & expected views |
| 🔍 **SEO Studio** | Optimize titles, tags, descriptions |
| 💬 **Sentiment Analysis** | Analyze comment emotions |
| 🎯 **Competitor Analysis** | Gap score & missed content opportunities |
| 🔥 **Trending Ideas** | 5 viral topics + 5 video ideas in your niche |
| ⏰ **Best Time to Post** | Optimal upload day & time |
| 👥 **Audience Persona** | Demographics & psychographics |
| 📋 **Content Strategy** | Pillar videos, Shorts, community posts |
| 📝 **Script Generator** | Hook, body, CTA framework |
| 🅰️ **Title A/B Ideas** | 5 clickable title variations |
| 🖼️ **Thumbnail Ideas** | Visual concept + text overlay |
| ⚡ **Smart Recommendations** | Immediate actions & long-term goals |
| 📈 **AI Report** | Executive growth summary |
| 🔐 **Google OAuth** | One-click Google login |
| 👤 **Manual Auth** | Register & login with email/password |

---

## 🛠️ Tech Stack

### Frontend
- **React 18** + **Vite** — fast, modern UI
- **TailwindCSS** — utility-first styling
- **Lucide React** — icons
- **Axios** — API calls

### Backend
- **FastAPI** (Python) — high-performance REST API
- **Motor** — async MongoDB driver
- **PyJWT** — JWT authentication
- **bcrypt** — password hashing (direct, bypassing passlib)
- **Google Auth** — OAuth token verification
- **OpenAI SDK** (pointed to Groq) — AI engine

### AI Engine
- **Groq API** — free, ultra-fast inference
- **Model:** `llama-3.1-8b-instant`

### Database
- **MongoDB Atlas** — cloud NoSQL database (free M0 cluster)

### Hosting
- **Vercel** — frontend (CDN, auto-deploy)
- **Render** — backend Python server (free tier)
- **cron-job.org** — keeps Render from sleeping (pings every 5 mins)

---

## 📁 Project Structure

```
nextframe-ai/
├── backend/
│   ├── main.py              # FastAPI app entry point
│   ├── config.py            # Environment settings
│   ├── database.py          # MongoDB connection
│   ├── models.py            # Pydantic models
│   ├── requirements.txt     # Python dependencies
│   ├── Procfile             # Render start command
│   ├── .env.example         # Environment variable template
│   ├── routes/
│   │   ├── auth.py          # Register, Login, Google OAuth
│   │   ├── core.py          # Dashboard, channel connect
│   │   └── ai.py            # All 14 AI endpoints
│   ├── services/
│   │   ├── openai_service.py # Groq AI integration + caching
│   │   └── youtube.py        # YouTube Data API v3
│   └── utils/
│       └── security.py       # bcrypt hashing, JWT tokens
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── App.jsx           # Routes + Error Boundary
        ├── api/axios.js      # Axios instance (env-aware URL)
        ├── context/
        │   └── AuthContext.jsx  # Global auth state
        ├── components/
        │   └── Layout.jsx    # Sidebar navigation
        └── pages/
            ├── Login.jsx
            ├── Register.jsx
            ├── Dashboard.jsx
            ├── Predictor.jsx
            ├── SeoStudio.jsx
            ├── SentimentAnalysis.jsx
            ├── CompetitorAnalysis.jsx
            ├── TrendingIdeas.jsx
            ├── BestTime.jsx
            └── AdvancedStudio.jsx
```

---

## ⚙️ Local Development Setup

### Prerequisites
- Python 3.10+
- Node.js 18+
- A MongoDB Atlas account (free)
- A Groq API key (free at console.groq.com)

### 1. Clone the repo
```bash
git clone https://github.com/abhisheksaiguntuku/nextframe-ai.git
cd nextframe-ai
```

### 2. Setup Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

pip install -r requirements.txt
```

Create your `.env` file (copy from `.env.example`):
```bash
copy .env.example .env
```

Fill in your values in `.env`:
```env
MONGODB_URL=mongodb+srv://user:password@cluster.mongodb.net/nextframe_ai
DATABASE_NAME=nextframe_ai
JWT_SECRET=your_long_random_secret_here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080
GROQ_API_KEY=your_groq_api_key
YOUTUBE_API_KEY=your_youtube_api_key
GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

Run the backend:
```bash
uvicorn main:app --reload
# Backend runs at http://localhost:8000
```

### 3. Setup Frontend
```bash
cd ../frontend
npm install
```

Create `.env.local`:
```env
VITE_API_URL=http://localhost:8000
```

Run the frontend:
```bash
npm run dev
# Frontend runs at http://localhost:5173
```

---

## 🌍 Production Deployment

### Step 1 — GitHub
Push your code to GitHub (already done if you're reading this).

### Step 2 — MongoDB Atlas
1. Go to https://cloud.mongodb.com → create free M0 cluster
2. Create a database user
3. Set Network Access → Allow all IPs (`0.0.0.0/0`)
4. Copy connection string → use as `MONGODB_URL`

### Step 3 — Backend on Render
1. Go to https://render.com → New Web Service
2. Connect your GitHub repo

| Setting | Value |
|---|---|
| Root Directory | `backend` |
| Environment | Python 3 |
| Build Command | `pip install -r requirements.txt` |
| Start Command | `uvicorn main:app --host 0.0.0.0 --port $PORT` |

Add all your environment variables (same as `.env` but production values). Add `FRONTEND_URL` = your Vercel URL.

### Step 4 — Frontend on Vercel
1. Go to https://vercel.com → Import GitHub repo
2. Set Root Directory to `frontend`
3. Add environment variable: `VITE_API_URL` = your Render URL
4. Deploy

### Step 5 — Keep Render Awake (Free)
1. Go to https://cron-job.org → create free account
2. New cronjob → URL: `https://your-render-url.onrender.com/` → every 5 minutes

### Step 6 — Google OAuth (for Google Login)
1. Go to https://console.cloud.google.com → Credentials
2. Edit your OAuth 2.0 Client
3. Add to **Authorized JavaScript origins**: your Vercel URL
4. Add to **Authorized redirect URIs**: your Vercel URL

---

## 🔑 Required API Keys

| Key | Where to get it | Free? |
|---|---|---|
| `GROQ_API_KEY` | https://console.groq.com | ✅ Free |
| `YOUTUBE_API_KEY` | https://console.cloud.google.com | ✅ Free (quota) |
| `GOOGLE_CLIENT_ID` | https://console.cloud.google.com → OAuth | ✅ Free |
| MongoDB Atlas | https://cloud.mongodb.com | ✅ Free M0 |

---

## 🔄 Updating the App

Every time you make changes, just push to GitHub:

```bash
git add .
git commit -m "your update message"
git push
```

Vercel and Render will **automatically redeploy** — zero manual work!

---

## 🐛 Known Notes

- **Render cold start:** First request after inactivity takes ~30s (solved by cron-job.org)
- **Google OAuth clock skew:** Handled with 60s tolerance in `routes/auth.py`
- **bcrypt compatibility:** Using `bcrypt` directly (bypassing `passlib`) due to version incompatibility

---

## 📄 License
MIT — free to use and modify.
