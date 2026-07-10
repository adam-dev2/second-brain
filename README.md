# Second Brain

Personal knowledge management system — save web content as cards, organize with tags/sections, search semantically using AI embeddings, and share curated collections.

---

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS 4 |
| Backend | Express 5, TypeScript |
| Database | MongoDB (Mongoose 8) |
| Vector DB | Qdrant (semantic search) |
| AI Embeddings | HuggingFace Inference API |
| Web Scraping | Jina AI |
| Auth | JWT + Passport (Google, GitHub OAuth) |
| Real-time | Socket.io |
| Validation | Zod 4 |

---

## Features

- **Content Cards** — Save any URL (article, video, tweet, link) as a searchable card with auto-detected type
- **Tagging** — Custom tags for categorization
- **Sections** — Organize cards into named sections
- **Semantic Search** — Natural language search via vector embeddings (HuggingFace → Qdrant)
- **AI Scraping** — Automatic content extraction via Jina AI when saving a URL
- **Public Sharing** — Generate share links for your brain (no account required to view)
- **Dashboard** — Stats, weekly activity, top tags
- **Authentication** — Email/password, Google OAuth, GitHub OAuth
- **Dark/Light Theme** — Toggleable
- **Real-time Updates** — Card processing status via Socket.io

---

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Qdrant (local or cloud)
- HuggingFace API key
- Jina AI API key

### Setup

```bash
git clone <repo-url>
cd second-brain

# Install dependencies
cd client && npm install
cd ../server && npm install
```

### Environment

**client/.env**
```env
VITE_BACKEND_URL=http://localhost:5000
```

**server/.env**
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
MONGO_URI=mongodb://localhost:27017/secondbrain
HUGGINGFACE_API_KEY=your_key
JINA_API_KEY=your_key
JWT_SECRET=your_secret
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=your_key
# Optional OAuth
GOOGLE_CLIENT_ID=your_id
GITHUB_CLIENT_ID=your_id
```

### Run

```bash
# Terminal 1
cd server && npm run dev

# Terminal 2
cd client && npm run dev
```

Frontend: http://localhost:5173  
Backend API: http://localhost:5000

---

## Project Structure

```
second-brain/
├── client/                  # React frontend
│   └── src/
│       ├── components/      # UI components (Card, Sidebar, AddCard, etc.)
│       ├── context/         # AuthContext, ThemeContext
│       ├── layouts/         # DashboardLayout
│       ├── pages/           # LandingPage, Dashboard, Cards, Search, Tags, Share, Section, AuthPages, ResetPassword
│       └── store/atoms/     # Recoil state atoms
├── server/                  # Express backend
│   └── src/
│       ├── controllers/     # auth, card, section, share, user, verifyUser
│       ├── middlewares/     # auth (JWT) middleware
│       ├── models/          # Mongoose schemas (User, Content, Tags, Link, Share, Section)
│       ├── routes/          # oauth, card, section, brain, user
│       ├── services/        # Card processing pipeline (scrape → embed → store)
│       ├── utils/           # embeddings, passport config, qdrant client, scrape, socketManager
│       └── validations/     # Zod schemas
└── README.md
```

### Processing Pipeline

1. User saves a URL → card created in MongoDB (`status: pending`)
2. Background processor scrapes content (Jina AI)
3. Generates vector embeddings (HuggingFace API)
4. Stores vectors in Qdrant for semantic search
5. Card status updated to `ready`
6. Socket.io event notifies the client

---

## API Overview

Base path: `/api/v1`

| Endpoint | Auth | Description |
|----------|------|-------------|
| `POST /auth/signup` | — | Register |
| `POST /auth/login` | — | Login |
| `POST /auth/logout` | — | Logout |
| `POST /auth/forgot-password` | — | Request reset |
| `POST /auth/reset-password` | — | Reset password |
| `GET /auth/google` | — | Google OAuth |
| `GET /auth/github` | — | GitHub OAuth |
| `GET /auth/me` | Cookie | Current user |
| `GET /content/cards` | JWT | List cards (paginated) |
| `GET /content/metrics` | JWT | Dashboard stats |
| `POST /content/card` | JWT | Create card |
| `PUT /content/editCard/:id` | JWT | Edit card |
| `DELETE /content/card/:id` | JWT | Delete card |
| `POST /content/query` | JWT | Semantic search |
| `GET /user/` | JWT | Get profile |
| `PUT /user/profile` | JWT | Update profile |
| `POST /brain/share` | JWT | Generate share link |
| `GET /brain/:shareLink` | — | View shared brain |
| `GET/POST /section/` | JWT | List/create sections |
| `DELETE /section/:id` | JWT | Delete section |
| `PATCH /section/:id` | JWT | Update section |
| `POST /section/move-card` | JWT | Move card between sections |

---

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Submit a pull request

---

## License

MIT
