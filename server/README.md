# Server (Backend) - Second Brain

An Express + TypeScript backend API server providing authentication, content management, semantic search, and real-time event streaming for the Second Brain knowledge management system.

## 📋 Quick Navigation

- [Folder Structure](#-folder-structure)
- [Tech Stack](#-tech-stack)
- [Architecture Overview](#-architecture-overview)
- [API Routes](#-api-routes)
- [Controllers & Business Logic](#-controllers--business-logic)
- [Data Models](#-data-models)
- [Authentication & Middleware](#-authentication--middleware)
- [Services & Utilities](#-services--utilities)
- [Database Setup](#-database-setup)
- [Getting Started](#-getting-started)

---

## 📁 Folder Structure

```
server/
├── src/
│   ├── app.ts                 # Express app setup & route mounting
│   ├── server.ts              # Entry point (port listener)
│   │
│   ├── routes/                # API route handlers
│   │   ├── oauthRoutes.ts     # Auth endpoints (signup/login/OAuth)
│   │   ├── cardRoutes.ts      # Card/content endpoints
│   │   ├── userRoutes.ts      # User profile endpoints
│   │   ├── brainRoutes.ts     # Share/public brain endpoints
│   │   └── eventRoutes.ts     # SSE (real-time events)
│   │
│   ├── controllers/           # Business logic for each route
│   │   ├── authController.ts  # Auth logic (signup, login, password reset)
│   │   ├── cardController.ts  # Card operations (create, edit, delete, query)
│   │   ├── userController.ts  # User profile management
│   │   ├── shareController.ts # Share/public brain logic
│   │   └── verifyUserController.ts # Token verification endpoint
│   │
│   ├── models/                # Mongoose data schemas
│   │   ├── User.ts            # User schema (email, password, OAuth IDs)
│   │   ├── Content.ts         # Card/content schema
│   │   ├── Tags.ts            # Tags schema
│   │   └── Link.ts            # Link metadata schema
│   │
│   ├── middlewares/
│   │   └── auth.ts            # JWT authentication middleware
│   │
│   ├── services/
│   │   └── processor.ts       # Background card processing service
│   │
│   ├── utils/
│   │   ├── embeddings.ts      # HuggingFace API integration for embeddings
│   │   ├── qDrant.ts          # Qdrant vector database client
│   │   ├── scrape.ts          # Web scraping utility (Jina AI)
│   │   ├── sseManager.ts      # Server-Sent Events manager
│   │   ├── passport.ts        # Passport OAuth configuration
│   │   └── errorHandler.ts    # Centralized error handling
│   │
│   ├── validations/           # Input validation schemas (Zod)
│   │   ├── AuthSchema.ts      # Auth validation rules
│   │   └── ContentSchema.ts   # Card validation rules
│   │
│   └── config/
│       ├── db.ts              # MongoDB connection
│       └── QdrantConfig.ts    # Qdrant vector DB connection
│
├── package.json               # Dependencies & scripts
├── tsconfig.json             # TypeScript configuration
├── eslint.config.ts          # ESLint configuration
└── .env                       # Environment variables
```

---

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Express.js 5.x |
| **Language** | TypeScript |
| **Runtime** | Node.js |
| **Database** | MongoDB (Mongoose ODM) |
| **Vector DB** | Qdrant (semantic search) |
| **Embeddings** | HuggingFace Inference API |
| **Auth** | JWT + Passport OAuth |
| **Web Scraping** | Jina AI |
| **Validation** | Zod |
| **HTTP Client** | Axios |
| **Security** | bcrypt, CORS, Cookie Parser |

---

## 🏗 Architecture Overview

### Request Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                 Incoming HTTP Request                   │
└────────────────┬────────────────────────────────────────┘
                 │
      ┌──────────▼──────────┐
      │   app.ts (Express)  │
      └──────────┬──────────┘
                 │
      ┌──────────▼──────────────────┐
      │  Middleware Chain:          │
      │  - CORS                     │
      │  - JSON parser              │
      │  - Cookie parser            │
      │  - Passport                 │
      └──────────┬──────────────────┘
                 │
      ┌──────────▼──────────────────┐
      │      Routes (routes/*.ts)   │
      └──────────┬──────────────────┘
                 │
      ┌──────────▼──────────────────────┐
      │   Middleware:                   │
      │   - AuthMiddleware (if needed)  │
      │   - Input Validation            │
      └──────────┬──────────────────────┘
                 │
      ┌──────────▼──────────────────────┐
      │  Controllers (controllers/*.ts) │
      │  Business Logic Execution       │
      └──────────┬──────────────────────┘
                 │
      ┌──────────▼──────────────────────┐
      │  Database & External Services:  │
      │  - MongoDB (Mongoose)           │
      │  - Qdrant (Vector DB)           │
      │  - HuggingFace API              │
      │  - Jina AI (Scraping)           │
      └──────────┬──────────────────────┘
                 │
      ┌──────────▼──────────────────────┐
      │     Response/Error Handling     │
      │     SSE Events (real-time)      │
      └──────────────────────────────────┘
```

### Card Processing Pipeline

```
1. User creates card
   ↓
2. Frontend: POST /api/v1/content/card
   ↓
3. Controller: createCard()
   - Validate input (title, link, tags)
   - Create document in MongoDB
   - Generate unique cardId (UUID)
   - Mark status as "pending"
   ↓
4. Send SSE Event: "startCardProcessing"
   ↓
5. Background Service: processCard()
   - Scrape webpage (Jina AI) → extract title/content
   - Generate embeddings (HuggingFace) → convert to vectors
   - Store in Qdrant vector DB → for semantic search
   - Update MongoDB status to "ready"
   ↓
6. Send SSE Event: "cardProcessed"
   ↓
7. Frontend: Receive event → Update UI
```

---

## 🔌 API Routes

### Route Mounting (app.ts)

```typescript
// Base path: /api/v1
/events              → eventRoutes        (SSE stream)
/me                  → verifyUserController (user verification)
/auth                → oauthRoutes        (auth endpoints)
/content             → cardRoutes         (card management)
/user                → userRoutes         (profile management)
/brain               → brainRoutes        (share/public content)
```

---

## 📡 Detailed API Endpoints

### **Authentication Routes** (`/api/v1/auth/`)

#### OAuth Endpoints
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/google` | Redirect to Google OAuth login | ❌ |
| GET | `/google/callback` | Google OAuth callback | ❌ |
| GET | `/github` | Redirect to GitHub OAuth login | ❌ |
| GET | `/github/callback` | GitHub OAuth callback | ❌ |

#### User Auth Endpoints
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/signup` | Register new user | ❌ |
| POST | `/login` | User login (email/password) | ❌ |
| POST | `/logout` | Clear JWT cookie | ❌ |
| POST | `/forgot-password` | Send password reset email | ❌ |
| POST | `/reset-password` | Reset password with token | ❌ |

**Key Details**:
- JWT token stored in HTTP-only cookie
- Cookie config: secure, sameSite, 7-day expiration
- OAuth redirects set cookie then redirect to frontend

```typescript
// Login request body
{ email: string, password: string }

// Response
{ token: jwt, user: { id, username, email } }
```

---

### **Card Management Routes** (`/api/v1/content/`)

| Method | Endpoint | Description | Auth | Handler |
|--------|----------|-------------|------|---------|
| GET | `/cards` | Fetch all user's cards | ✅ | `FetchAllCards` |
| GET | `/metrics` | Get dashboard stats | ✅ | `FetchMetrics` |
| POST | `/card` | Create new card | ✅ | `createCard` |
| PUT | `/editCard/:id` | Update existing card | ✅ | `EditCard` |
| DELETE | `/card/:id` | Delete a card | ✅ | `DeleteCard` |
| POST | `/query` | AI semantic search | ✅ | `Query` |

**Create Card Request**:
```typescript
{
  title: string,
  link: string,
  tags: string[],
  type: "document" | "video" | "tweet" | "link"
}
```

**Create Card Response**:
```typescript
{
  message: "Card created successfully",
  card: {
    _id: ObjectId,
    cardId: string (UUID),
    title: string,
    link: string,
    tags: string[],
    type: string,
    share: boolean,
    status: "pending" (will change to "ready" after processing),
    createdAt: Date,
    updatedAt: Date
  }
}
```

**Fetch Metrics Response**:
```typescript
{
  stats: {
    totalCards: number,
    cardsChangePercent: number,
    tags: number,
    tagsChange: number,
    aiSearches: number,
    searchesChange: number,
    thisWeek: number
  },
  weeklyActivity: Array<{ day: string, cards: number }>,
  topTags: Array<{ name: string, count: number, color: string }>,
  recentCards: Array<{ id, title, type, tags, createdAt }>
}
```

**Query (Semantic Search) Request**:
```typescript
{
  query: string (natural language),
  limit: number (1-20)
}
```

**Query Response**:
```typescript
{
  results: Array<{
    id: string,
    title: string,
    link: string,
    tags: string[],
    score: number (similarity score),
    type: string
  }>
}
```

---

### **User Profile Routes** (`/api/v1/user/`)

| Method | Endpoint | Description | Auth | Handler |
|--------|----------|-------------|------|---------|
| GET | `/` | Fetch user profile | ✅ | `FetchUser` |
| POST | `/userconfirmation` | Verify password | ✅ | `FetchUserDetails` |
| PUT | `/profile` | Update user profile | ✅ | `FetchProfile` |

**Update Profile Request**:
```typescript
{
  username?: string,
  email?: string,
  avatar?: string (URL or base64),
  password?: string (new password)
}
```

**User Profile Response**:
```typescript
{
  userProfile: {
    username: string,
    email: string,
    avatar: string | null
  }
}
```

---

### **Share/Public Brain Routes** (`/api/v1/brain/`)

| Method | Endpoint | Description | Auth | Handler |
|--------|----------|-------------|------|---------|
| GET | `/share` | Generate share link | ✅ | `ShareBrain` |
| GET | `/:shareLink` | View public shared cards | ❌ | `GetShareBrain` |

**Share Request**:
```typescript
{
  cardIds: string[] (array of card MongoDB IDs)
}
```

**Share Response**:
```typescript
{
  shareLink: string (unique ID),
  cards: Array<card objects>,
  message: "Share link created"
}
```

**Public Share View Response**:
```typescript
{
  ShareableCards: Array<{
    title: string,
    link: string,
    tags: string[],
    type: string,
    share: boolean
  }>,
  message: "Cards fetched successfully"
}
```

---

### **User Verification Route** (`/api/v1/me`)

| Method | Endpoint | Description | Auth | Handler |
|--------|----------|-------------|------|---------|
| GET | `/` | Verify JWT & get user info | ✅ | `verifyUserController` |

**Response**:
```typescript
{
  user: {
    id: string,
    username: string,
    email: string,
    avatar: string | null
  }
}
```

---

### **Real-time Events Route** (`/events`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/events` | SSE stream for card processing | ✅ |

**Server-Sent Events Sent**:

```
Event: startCardProcessing
Data: { message: "Processing card...", cardId: string }

Event: cardProcessed
Data: { message: "Card ready", cardId: string, title: string }

Event: cardFailed
Data: { message: "Processing failed", error: string }

Keepalive: :keepalive (every 15 seconds)
```

**Connection Management**:
- Client connects: `addClient(userId, response)` → stored in memory map
- Client disconnects: `removeClient(userId)` → cleaned up
- Keepalive sent every 15 seconds to prevent timeout

---

## 🧠 Controllers & Business Logic

### **authController.ts**

Handles all authentication operations:

#### `SignupController`
- Validate email doesn't already exist
- Hash password with bcrypt (salt rounds: 10)
- Create new User document
- Return success/error

#### `LoginController`
- Find user by email
- Compare password with bcrypt
- Generate JWT token (7-day expiration)
- Set HTTP-only cookie
- Return user info

#### `LogoutController`
- Clear token cookie
- Return success

#### `ForgetPasswordController`
- Find user by email
- Generate reset token
- Send email with reset link (via Nodemailer)
- Return success

#### `ResetPasswordController`
- Verify reset token
- Hash new password
- Update user password
- Return success

---

### **cardController.ts**

Handles card/content operations:

#### `createCard`
- Validate request body (Zod validation)
- Create Content document with status "pending"
- Generate UUID for cardId
- Trigger async `processCard()` service
- Send SSE `startCardProcessing` event
- Return card object

#### `FetchAllCards`
- Get all Content documents for userId
- Return array of cards

#### `EditCard`
- Find card by ID
- Validate authorization (card belongs to user)
- Update card fields
- Return updated card

#### `DeleteCard`
- Find card by ID
- Delete from MongoDB
- Delete from Qdrant vector DB
- Return success

#### `Query` (Semantic Search)
- Validate query and limit
- Generate embedding for query text (HuggingFace)
- Search Qdrant vector DB for similar embeddings
- Return ranked results with similarity scores

#### `FetchMetrics`
- Calculate stats:
  - Total cards count
  - Cards added this week vs previous week (% change)
  - Unique tags count
  - AI searches count
  - Weekly activity breakdown (last 7 days)
  - Top 5 tags with counts
  - Recent 5 cards
- Return metrics object

---

### **userController.ts**

#### `FetchUser`
- Get user profile from MongoDB
- Return username, email, avatar

#### `FetchUserDetails`
- Verify password matches (for sensitive operations)
- Return user confirmation

#### `FetchProfile` (Update)
- Update user avatar, username, or email
- If password included, hash it first
- Return updated profile

---

### **shareController.ts**

#### `ShareBrain`
- Accept array of cardIds
- Create share entry
- Generate unique shareLink (nanoid or UUID)
- Return share link to frontend

#### `GetShareBrain`
- Accept shareLink parameter
- Find shared content
- Return public card data (no auth required)

---

### **verifyUserController.ts**

- Extract JWT from cookie/header
- Verify token signature
- Fetch user from MongoDB
- Attach user to request object
- Return user info to frontend

---

## 📊 Data Models

### **User Schema** (`models/User.ts`)

```typescript
interface IUser {
  _id: ObjectId,              // MongoDB ID
  googleId?: string,          // Google OAuth ID
  githubId?: string,          // GitHub OAuth ID
  username: string (required),
  email: string (required),
  password?: string,          // Optional (OAuth users may not have)
  sharelink: string,          // Unique share link
  avatar?: string,            // Profile picture URL
  updatedAt: string
}
```

### **Content/Card Schema** (`models/Content.ts`)

```typescript
interface IContent {
  _id: ObjectId,              // MongoDB ID
  userId: ObjectId,           // Reference to User
  link: string (required),
  title: string (required),
  type: string (required),    // "document" | "video" | "tweet" | "link"
  tags: string[],
  share: boolean,             // Publicly shared?
  status: string,             // "pending" | "ready" | "failed"
  embedding?: number[],       // Vector from HuggingFace
  cardId: string,             // UUID for tracking
  createdAt: Date,
  updatedAt: Date
}
```

### **Tags Schema** (`models/Tags.ts`)

- Stores tag metadata and usage counts

### **Link Schema** (`models/Link.ts`)

- Stores scraped metadata from links

---

## 🔐 Authentication & Middleware

### **AuthMiddleware** (`middlewares/auth.ts`)

Protects routes requiring authentication:

1. Extract JWT from:
   - Cookie: `req.cookies.token`
   - Header: `Authorization: Bearer <token>`
2. Verify token signature with JWT_SECRET
3. Decode to get userId
4. Fetch user from MongoDB
5. Attach user object to `req.user`
6. Call `next()` or return 401

```typescript
// After middleware, controller accesses:
const userId = req.user?.id;
const username = req.user?.username;
```

---

### **Passport OAuth** (`utils/passport.ts`)

Configures Google & GitHub OAuth:

```typescript
// Google Strategy
- Client ID & Secret from env
- Callback URL: /auth/google/callback
- Finds/creates user in MongoDB
- Returns user object to callback handler

// GitHub Strategy
- Similar setup to Google
- Callback URL: /auth/github/callback
```

**JWT Cookie Setting**:
```typescript
function setJwtCookie(res: Response, user: JwtUser) {
  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
  res.cookie("token", token, {
    httpOnly: true,       // JS cannot access
    secure: true,         // HTTPS only
    sameSite: "lax",      // CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
    domain: ".madebyadam.xyz"
  });
}
```

---

## 🛠 Services & Utilities

### **Processor Service** (`services/processor.ts`)

Background processing for cards:

```typescript
export const processCard = async (
  cardId: string,
  userId: string,
  title: string,
  link: string
)
```

**Steps**:
1. **Scrape Link**: `scrapeLink(link)` → extracts content via Jina AI
2. **Generate Embedding**: `getEmbedding(title + content)` → HuggingFace API
3. **Store in Qdrant**: Upsert vector with payload (cardId, userId, title, link)
4. **Update Status**: Set MongoDB status to "ready"
5. **Error Handling**: On failure, set status to "failed"

---

### **Embeddings Utility** (`utils/embeddings.ts`)

Integrates with HuggingFace Inference API:

```typescript
export const getEmbedding = async (text: string): Promise<number[]>
```

**Process**:
1. Send text to HuggingFace API
2. Model: `sentence-transformers/all-MiniLM-L6-v2`
3. Returns 384-dimensional vector
4. **Retry Logic**: Auto-retry on 503 (model loading)
5. **Error Handling**: Throws if fails after retries

---

### **Qdrant Utility** (`utils/qDrant.ts`)

Vector database client for semantic search:

```typescript
const VECTOR_SIZE = 384;
const COLLECTION_NAME = "Card";

export const qdrantClient = new QdrantClient({
  url: process.env.QDRANT_URL || "http://localhost:8080",
  apiKey: process.env.QDRANT_API_KEY
});
```

**Operations**:
- **Upsert**: Store card vector + metadata
- **Search**: Find similar vectors by cosine similarity
- **Delete**: Remove vector when card deleted

---

### **Web Scraping** (`utils/scrape.ts`)

Uses Jina AI for content extraction:

```typescript
export const scrapeLink = async (url: string): Promise<string>
```

**Process**:
1. Call Jina API: `https://r.jina.ai/{url}`
2. Extracts: title, content, metadata
3. Returns cleaned text
4. Used for embedding generation

---

### **SSE Manager** (`utils/sseManager.ts`)

Manages real-time connections:

```typescript
const clients = new Map<string, Response>(); // userId → Response

export const addClient(userId: string, res: Response)    // Add connection
export const removeClient(userId: string)                 // Remove connection
export const sendEvent(userId: string, event: string, data: IData) // Send event
```

**Event Sending**:
```typescript
sendEvent(userId, "cardProcessed", {
  cardId: "abc123",
  title: "My Article",
  message: "Processing complete"
});
// Sends to client:
// event: cardProcessed
// data: {"cardId":"abc123","title":"My Article","message":"..."}
```

---

### **Validation Schemas** (`validations/`)

Uses **Zod** for runtime input validation:

#### AuthSchema.ts
- Login: `{ email, password }`
- Signup: `{ username, email, password, confirmPassword }`
- Reset: `{ email }`, `{ password, token }`

#### ContentSchema.ts
- Create Card: `{ title, link, tags, type }`
- Edit Card: partial fields
- Query: `{ query, limit }`

---

## 🗄️ Database Setup

### **MongoDB** (`config/db.ts`)

```typescript
mongoose.connect(process.env.MONGO_URI);
```

**Collections**:
- `users` — User accounts
- `contents` — Cards/content
- `tags` — Tag data
- `links` — Link metadata

---

### **Qdrant** (`config/QdrantConfig.ts`)

Vector database for semantic search:

```typescript
const qdrantClient = new QdrantClient({
  url: process.env.QDRANT_URL,   // e.g., http://localhost:8080
  apiKey: process.env.QDRANT_API_KEY
});
```

**Collections**:
- `Card` — Stores card embeddings
- Vector size: 384 dimensions
- Payload includes: cardId, userId, title, link

---

## ⚙️ Getting Started

### Environment Setup

Create `.env` file:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/secondbrain

# JWT
JWT_SECRET=your-super-secret-key-min-32-chars

# Qdrant Vector DB
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=your-qdrant-api-key

# HuggingFace Embeddings
HUGGINGFACE_API_KEY=hf_your_api_key

# Jina AI Scraping
JINA_API=jina_your_api_key

# OAuth - Google
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/v1/auth/google/callback

# OAuth - GitHub
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-secret
GITHUB_CALLBACK_URL=http://localhost:3000/api/v1/auth/github/callback

# Frontend
FRONTEND_URL=http://localhost:5173

# Email (Nodemailer)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
```

### Installation

```bash
cd server
npm install
```

### Development

```bash
npm run dev
# Starts with TSX loader on http://localhost:5000
```

### Build

```bash
npm run build
# Compiles TypeScript to JavaScript
```

### Lint & Format

```bash
npm run lint      # Run ESLint with auto-fix
npm run format    # Format with Prettier
```

### Testing

```bash
npm test
# Runs Jest with TypeScript support
```

---

## 🔄 Common Workflows

### User Registration Flow

1. Frontend: `POST /api/v1/auth/signup` with email/password
2. Server: Validate input, hash password, create user
3. MongoDB: Insert user document
4. Server: Return success message
5. Frontend: Redirect to login

### Card Creation & Processing Flow

1. Frontend: `POST /api/v1/content/card` with title/link/tags
2. Server: Validate, create card with "pending" status
3. Server: Send SSE `startCardProcessing` event
4. Server: Async `processCard()` starts:
   - Scrape link content
   - Generate embedding
   - Store in Qdrant
   - Update status to "ready"
5. Server: Send SSE `cardProcessed` event
6. Frontend: Receive event, update card list

### Semantic Search Flow

1. Frontend: `POST /api/v1/content/query` with search text
2. Server: Generate embedding for search query
3. Server: Query Qdrant for similar card embeddings
4. Server: Return ranked results (by similarity score)
5. Frontend: Display results

### OAuth Login Flow

1. Frontend: User clicks "Login with Google"
2. Frontend: Redirects to `GET /api/v1/auth/google`
3. Server: Passport redirects to Google consent screen
4. User: Approves permissions
5. Google: Redirects to `GET /api/v1/auth/google/callback`
6. Server: Passport handles callback, finds/creates user
7. Server: Sets JWT cookie, redirects to frontend dashboard
8. Frontend: Detects redirect, stores user, loads dashboard

---

## 🐛 Error Handling

Centralized error responses:

```typescript
// Validation Error
{ status: 400, message: "Validation failed", details: {...} }

// Unauthorized
{ status: 401, message: "Token missing" | "Invalid token" }

// Forbidden
{ status: 403, message: "Access denied" }

// Not Found
{ status: 404, message: "Resource not found" }

// Server Error
{ status: 500, message: "Internal Server Error", error: {...} }
```

---

## 📝 Notes

- **CORS**: Configured for frontend domain (localhost + production)
- **Credentials**: All credentials in environment variables
- **Rate Limiting**: Not currently implemented (consider adding)
- **Database Indexing**: Add indexes on `userId`, `cardId`, `email` for performance
- **API Versioning**: Using `/api/v1/` prefix for future versioning
- **Async Processing**: Card processing happens async via service (not blocking request)
- **Real-time Updates**: SSE for real-time card processing without polling

---

## 🚀 Quick Links

- [Express Middleware Documentation](https://expressjs.com/en/guide/using-middleware.html)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Qdrant Vector DB](https://qdrant.tech/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc7519)
- [Passport.js](http://www.passportjs.org/)
- [HuggingFace API](https://huggingface.co/docs/api-inference)

