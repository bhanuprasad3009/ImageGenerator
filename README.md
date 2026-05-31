<<<<<<< HEAD
# AetherArt AI - Ultimate AI Image Generator

AetherArt AI is a premium, responsive, and visually stunning full-stack AI Image Generator web application. Inspired by Midjourney and Leonardo AI, it features futuristic neon glassmorphism design, advanced canvas integrations, AI prompt engineering enhancements, social feeds, and a full Stripe subscription sandbox.

---

## 🚀 Key Features

1. **Futuristic Visual Studio**: Create stunning graphics using custom aspect ratios (1:1, 16:9, 9:16) and targeted style overlays (Realistic, Anime, Cyberpunk, Fantasy, 3D Octane Render, Pixel Art).
2. **AI Prompt Enhancer**: Turn simple, generic ideas ("a dog") into professional, descriptive photographic master prompts instantly.
3. **Voice-to-Prompt**: Integrated voice transcription using the browser's Web Speech API. Click the mic icon, speak your prompt, and let the AI build it.
4. **Community Showcase & Social Circle**: View trending public art with paginated search grids. Engage in community interactions: like creations, toggle favorites, and write feedback comments.
5. **Advanced Aux Tools**:
   - **4K Upscaler**: Simulates noise reduction, sharpness restoration, and bicubic interpolation to upscale designs.
   - **Isolated Cutout**: Simulates precise background threshold masking to strip backgrounds and output transparent PNG layers.
6. **Unified Billing & Subscriptions**: Integrated Free, Pro, and Premium tiers with full Stripe checkout and customer portals.
7. **Banned Words Blocklist**: Secure keyword filters (NSFW, gore, nudity, toxic) immediately blocking abusive prompt synthesis.
8. **Robust Admin Dashboard**: Superuser command hub detailing users control grids, credit topups, plan modifications, metrics graphs, and blocklist control.

---

## 🛠️ Technology Stack

* **Frontend**: React.js (Vite), Tailwind CSS, Framer Motion, Axios, React Router, Lucide Icons.
* **Backend**: Node.js, Express.js, JWT Authentication, Custom Credit & Frequency Rate Limiters.
* **Database**: MongoDB (Mongoose models for Users, Images, and Banned Phrases).
* **AI Engine**: Dual Stability AI XL & OpenAI DALL-E 3 API (with fully working **Pollinations AI high-res fallback** when keys are omitted).
* **Payment Gateway**: Stripe SDK checkout, billing portals, and webhooks (with fully working **Simulated Sandbox checkout** when keys are omitted).

---

## 💻 Developer Setup & Running Instructions

### Prerequisites
* [Node.js](https://nodejs.org/) installed (v18+ recommended).
* [MongoDB](https://www.mongodb.com/) running locally or a MongoDB Atlas cloud URI.

### Step 1: Clone and Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install --legacy-peer-deps
```

### Step 2: Configure Environment Variables

Create a `.env` file inside the `server/` directory. A standard pre-configured local development configuration file has already been generated for you:

`server/.env`:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://127.0.0.1:27017/aetherart
JWT_SECRET=aetherart_secret_key_123456
```

*(Optional keys: `STABILITY_KEY`, `OPENAI_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_PRO_PRICE_ID`, `STRIPE_PREMIUM_PRICE_ID`, `STRIPE_WEBHOOK_SECRET`)*

### Step 3: Seed Mongoose Database
Run our pre-configured seeding routine. This connects to MongoDB, creates test accounts, seeds word blocklists, and **downloads beautiful AI starter art** into your server filesystem so the community gallery is populated upon your first login!

```bash
cd server
npm run seed
```

### Step 4: Start Server and Client

```bash
# Launch Express Backend
cd server
npm run dev

# Launch React Client
cd ../client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to experience AetherArt AI!

---

## 💡 Simulated Sandbox Workflows (No Keys Needed!)

To let developers and reviewers test the entire premium SaaS portal offline instantly without paying for OpenAI or setting up Stripe accounts, we have implemented smart simulation layers:

1. **Fallback Image Generation**: If `STABILITY_KEY` or `OPENAI_KEY` are left blank, AetherArt transparently routes visual synthesis to Pollinations AI (a free, beautiful Stable Diffusion API wrapper). It downloads the resulting graphic buffer locally, files it inside `/generations/`, and returns it. Your credit balance decreases by 1 credit (bypassed on Premium!).
2. **Sandbox Payment Redirection**: If `STRIPE_SECRET_KEY` is left blank, selecting Pro or Premium redirect options routes you to our **Sandbox Simulation Engine**. A gorgeous interactive modal confirms simulated payment completion, immediately updates user models, top-ups credits, activates plan badges, and triggers responsive frontend updates in real time!
3. **Preloaded Sandbox Accounts**:
   * **Test User**: `john@aetherart.com` / `user123` *(Has 150 credits and Pro status)*
   * **Admin Hub**: `admin@aetherart.com` / `admin123` *(Has 9999 credits, Premium, and full access to Admin Control Center)*

---

## 📁 Repository Structure

```
AetherArt/
├── client/
│   ├── src/
│   │   ├── components/  # Sidebar, Header, ProtectedRoute
│   │   ├── context/     # AuthContext, ThemeContext
│   │   ├── pages/       # Landing, Auth, Dashboard, Gallery, Favorites, Profile, Admin
│   │   ├── services/    # api.js (Axios)
│   │   ├── index.css    # Neon glassmorphism stylesheets
│   │   └── main.jsx
│   ├── tailwind.config.js
│   └── package.json
└── server/
    ├── config/          # db.js (Mongoose connection)
    ├── middleware/      # Auth JWT, Credit Rate Limiters, Error Handlers
    ├── models/          # User, Image, Blocklist Schemas
    ├── routes/          # API Controllers (Auth, Generate, Social, Stripe, Admin, Tools)
    ├── utils/           # seed.js (DB population script)
    └── server.js
```

---

## 🌐 Production Deployment Guidelines

### 1. MongoDB Atlas
1. Sign up on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and spin up a free M0 cluster.
2. In network security, allow access from `0.0.0.0/2.0` (all traffic).
3. Copy your database connection string and replace `MONGO_URI` in production `.env`.

### 2. Backend on Render
1. Create a Web Service on [Render](https://render.com/).
2. Select your repository, configure build command `npm install` and start command `npm start` (target root `server/`).
3. Set environment variables (`MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`).

### 3. Frontend on Vercel
1. Create a project on [Vercel](https://vercel.com/) pointing to the `client/` subdirectory.
2. Configure build command `npm run build` and output directory `dist`.
3. Set environment variable `VITE_API_URL` pointing to your live Render server address (e.g. `https://aetherart-api.onrender.com/api`).
=======
# ImageGenerator
>>>>>>> 510db5e7ab8aed8ae869aaf6fe7facecf78d5fa8
<!-- Repushed at 2026-05-31T15:33:35+05:30 -->
