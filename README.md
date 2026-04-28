# 🛡️ SportShield — Digital Asset Protection for Sports Media

> Google Solutions Challenge | MERN Stack Project

SportShield helps sports organizations **register, track, and flag unauthorized use** of their official digital media assets across the internet.

---

## 📁 Project Structure

```
SportShield/
├── server/          # Node.js + Express + MongoDB API
│   ├── models/      # Mongoose schemas (Asset, Flag)
│   ├── routes/      # REST API routes
│   ├── .env         # Environment variables (edit this!)
│   └── index.js     # Server entry point
└── client/          # React (Vite) Frontend
    └── src/
        ├── pages/       # Dashboard, Assets, Flags
        ├── components/  # Sidebar, Modals, Toast
        ├── hooks/       # useToast
        └── api.js       # Axios API helper
```

---

## 🚀 Quick Start

### 1. Prerequisites
- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/try/download/community) running locally **OR** a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

### 2. Configure the database
Edit `server/.env`:
```env
# Local MongoDB
MONGO_URI=mongodb://localhost:27017/sportshield

# OR MongoDB Atlas
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/sportshield

PORT=5000
```

### 3. Start the Backend
```bash
cd server
npm install
npm run dev
# → Server running at http://localhost:5000
```

### 4. Start the Frontend
```bash
cd client
npm install
npm run dev
# → App running at http://localhost:3000
```

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **Register Assets** | Register official sports media with metadata + auto-generated fingerprint |
| **Asset Dashboard** | Live stats: total, active, flagged, verified assets |
| **Report Flags** | Paste suspected unauthorized URLs to file a report |
| **Manage Reports** | Confirm or dismiss each flag; asset status updates automatically |
| **Search & Filter** | Filter assets by status; filter flags by resolution state |

---

## 🔌 API Endpoints

### Assets
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/assets` | List all assets |
| GET | `/api/assets/:id` | Get single asset |
| POST | `/api/assets` | Register new asset |
| PUT | `/api/assets/:id` | Update asset |
| DELETE | `/api/assets/:id` | Delete asset |
| GET | `/api/assets/stats/summary` | Dashboard stats |

### Flags
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/flags` | List all flags |
| POST | `/api/flags` | Report unauthorized use |
| PUT | `/api/flags/:id` | Update flag status |
| DELETE | `/api/flags/:id` | Delete flag |
| GET | `/api/flags/stats/summary` | Flag stats |

---

## 🛠️ Tech Stack
- **MongoDB** — Database
- **Express.js** — REST API
- **React** (Vite) — Frontend
- **Node.js** — Runtime
- **Mongoose** — ODM
- **React Router** — Client routing
- **Axios** — HTTP client
