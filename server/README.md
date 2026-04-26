# Second Brain Server (Backend)

A robust, scalable Express.js backend API server built with TypeScript that powers the Second Brain knowledge management application. This server provides comprehensive authentication, content management, AI-powered semantic search, real-time event streaming, and secure data persistence.

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Available Scripts](#-available-scripts)
- [Project Structure](#-project-structure)
- [Architecture](#-architecture)
- [API Reference](#-api-reference)
- [Authentication](#-authentication)
- [Data Models](#-data-models)
- [Database Configuration](#-database-configuration)
- [Services & Utilities](#-services--utilities)
- [Real-time Features](#-real-time-features)
- [Security](#-security)
- [Deployment](#-deployment)
- [Testing](#-testing)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Project Overview

Second Brain Server is the backend API that handles all business logic, data persistence, and external service integrations for the Second Brain application. It provides RESTful endpoints for user management, content processing, semantic search, and real-time updates.

The server is designed with scalability, security, and maintainability in mind, using modern Node.js patterns and best practices.

---

## ✨ Features

### Core Functionality
- **User Authentication**: JWT-based auth with OAuth integration (Google, GitHub)
- **Content Management**: Full CRUD operations for knowledge cards
- **AI Semantic Search**: Vector-based search using embeddings
- **Real-time Updates**: Server-Sent Events for live processing status
- **Public Sharing**: Secure shareable links for content collections
- **Background Processing**: Asynchronous card processing pipeline
- **Email Notifications**: Password reset and user notifications

### Technical Features
- **Type-Safe**: Full TypeScript implementation with strict typing
- **Input Validation**: Runtime validation using Zod schemas
- **Error Handling**: Centralized error management and logging
- **Database Integration**: MongoDB with Mongoose ODM
- **Vector Database**: Qdrant for semantic search capabilities
- **External APIs**: HuggingFace for embeddings, Jina AI for web scraping
- **Security**: CORS, CSRF protection, secure cookies, password hashing
- **Scalability**: Asynchronous processing, connection pooling, caching

### Developer Experience
- **Hot Reload**: Development server with automatic restarts
- **Linting & Formatting**: ESLint and Prettier configuration
- **Testing**: Jest test framework with TypeScript support
- **API Documentation**: Comprehensive endpoint documentation
- **Environment Management**: Flexible configuration for different environments

---

## 🛠 Tech Stack

### Core Framework
- **Express.js 5.1**: Fast, unopinionated web framework for Node.js
- **TypeScript 5.9**: Type-safe JavaScript with advanced features
- **Node.js**: Server-side JavaScript runtime

### Database & Storage
- **MongoDB 8.x**: NoSQL document database with Mongoose ODM
- **Qdrant**: Vector database for semantic search
- **Redis 5.x**: In-memory data structure store (optional caching)

### Authentication & Security
- **JWT 9.x**: JSON Web Tokens for stateless authentication
- **Passport.js**: Authentication middleware with OAuth strategies
- **bcrypt 6.x**: Password hashing with salt
- **cookie-parser**: Secure HTTP cookie handling

### External Services
- **HuggingFace API**: AI model inference for text embeddings
- **Jina AI**: Web scraping and content extraction
- **Nodemailer**: Email sending for notifications

### Development Tools
- **ESLint 9.x**: Code linting with TypeScript support
- **Prettier 3.x**: Code formatting
- **Jest 30.x**: Testing framework with TypeScript
- **tsx 4.x**: TypeScript execution and REPL
- **supertest**: HTTP endpoint testing

### Utilities
- **Zod 4.x**: Runtime type validation and schema parsing
- **Axios 1.12**: HTTP client for external API calls
- **nanoid**: Unique ID generation
- **UUID**: Universally unique identifier generation
- **cors**: Cross-origin resource sharing middleware

---

## 📋 Prerequisites

Before running the server, ensure you have:

- **Node.js**: Version 18.x or higher
- **npm**: Version 8.x or higher
- **MongoDB**: Local installation or cloud instance (MongoDB Atlas)
- **Qdrant**: Vector database instance (local or cloud)
- **Redis**: Optional, for caching and session storage

### System Requirements
- **RAM**: Minimum 2GB, recommended 4GB
- **Storage**: 1GB free space for dependencies and data
- **Network**: Internet connection for external API calls

### External Services Setup
- **HuggingFace Account**: API key for embeddings
- **Jina AI Account**: API key for web scraping
- **OAuth Applications**: Google and GitHub OAuth apps configured
- **Email Service**: SMTP configuration for notifications

---

## 🚀 Installation & Setup

### 1. Navigate to Server Directory
```bash
cd server
```

### 2. Install Dependencies
```bash
npm install
```
This installs all dependencies listed in `package.json`.

### 3. Environment Configuration
Create a `.env` file in the server root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Database Configuration
MONGO_URI=mongodb://localhost:27017/secondbrain
# Or for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/secondbrain

# Redis (Optional)
REDIS_URL=redis://localhost:6379

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long

# Qdrant Vector Database
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=your-qdrant-api-key

# AI Services
HUGGINGFACE_API_KEY=hf_your_huggingface_api_key
JINA_API_KEY=your_jina_ai_api_key

# OAuth - Google
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback

# OAuth - GitHub
GITHUB_CLIENT_ID=your-github-oauth-client-id
GITHUB_CLIENT_SECRET=your-github-oauth-client-secret
GITHUB_CALLBACK_URL=http://localhost:5000/api/v1/auth/github/callback

# Email Configuration (for password reset)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
```

**Environment Variables Explained:**
- `PORT`: Server listening port (default: 5000)
- `NODE_ENV`: Environment mode (development/production)
- `FRONTEND_URL`: Frontend application URL for CORS
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token signing (keep secure!)
- `QDRANT_URL/API_KEY`: Qdrant vector database credentials
- `HUGGINGFACE_API_KEY`: HuggingFace API key for embeddings
- `JINA_API_KEY`: Jina AI API key for web scraping
- `GOOGLE_CLIENT_ID/SECRET`: Google OAuth credentials
- `GITHUB_CLIENT_ID/SECRET`: GitHub OAuth credentials

### 4. Database Setup
Ensure MongoDB and Qdrant are running:

```bash
# Start MongoDB (if local)
mongod

# Start Qdrant (if local)
docker run -p 6333:6333 qdrant/qdrant
```

### 5. Start Development Server
```bash
npm run dev
```
The server will start on `http://localhost:5000`

---

## 📜 Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `tsx src/server.ts` | Start development server with hot reload |
| `build` | `tsc -b` | Compile TypeScript to JavaScript |
| `lint` | `eslint . --ext .ts --fix` | Run ESLint with auto-fix |
| `format` | `prettier --write src` | Format code with Prettier |
| `test` | `cross-env NODE_OPTIONS=--experimental-vm-modules jest --config jest.config.cjs` | Run Jest tests |

### Script Details

#### Development Server (`npm run dev`)
- Uses `tsx` for TypeScript execution without compilation
- Enables hot reload on file changes
- Includes source maps for debugging
- Shows detailed error messages

#### Build Process (`npm run build`)
- Compiles TypeScript to JavaScript using `tsc`
- Generates type declaration files
- Outputs to `dist/` directory
- Ready for production deployment

#### Linting (`npm run lint`)
- Runs ESLint on all TypeScript files
- Includes TypeScript-specific rules
- Automatically fixes fixable issues
- Reports remaining issues

#### Testing (`npm test`)
- Runs Jest test suite
- Uses `cross-env` for cross-platform compatibility
- Supports ES modules with experimental VM modules
- Includes test coverage reporting

---

## 📁 Project Structure

```
server/
├── src/
│   ├── app.ts                    # Express app configuration and middleware
│   ├── server.ts                 # Server entry point and startup
│   │
│   ├── config/                   # Configuration files
│   │   ├── db.ts                 # MongoDB connection setup
│   │   └── QdrantConfig.ts       # Qdrant vector database config
│   │
│   ├── controllers/              # Business logic handlers
│   │   ├── authController.ts     # Authentication operations
│   │   ├── cardController.ts     # Card/content management
│   │   ├── shareController.ts    # Public sharing logic
│   │   ├── userController.ts     # User profile operations
│   │   └── verifyUserController.ts # JWT verification
│   │
│   ├── middlewares/              # Express middleware
│   │   └── auth.ts               # JWT authentication middleware
│   │
│   ├── models/                   # Mongoose data schemas
│   │   ├── Content.ts            # Card/content schema
│   │   ├── Link.ts               # Link metadata schema
│   │   ├── Section.ts            # Content sections schema
│   │   ├── Tags.ts               # Tags schema
│   │   └── User.ts               # User account schema
│   │
│   ├── routes/                   # API route definitions
│   │   ├── authRoutes.ts         # Authentication endpoints
│   │   ├── brainRoutes.ts        # Public sharing routes
│   │   ├── cardRoutes.ts         # Card management routes
│   │   ├── eventRoutes.ts        # SSE real-time routes
│   │   ├── sectionRoutes.ts      # Section management routes
│   │   └── userRoutes.ts         # User profile routes
│   │
│   ├── services/                 # Background services
│   │   └── processor.ts          # Card processing service
│   │
│   ├── utils/                    # Utility functions
│   │   ├── embeddings.ts         # HuggingFace API integration
│   │   ├── handleError.ts        # Error handling utilities
│   │   ├── passport.ts           # OAuth configuration
│   │   ├── qDrant.ts             # Qdrant client utilities
│   │   ├── resetPasswordTemplate.ts # Email templates
│   │   ├── scrape.ts             # Web scraping utilities
│   │   └── sseManager.ts         # Server-Sent Events manager
│   │
│   ├── validations/              # Input validation schemas
│   │   ├── AuthSchema.ts         # Authentication validation
│   │   └── ContentSchema.ts      # Content validation
│   │
│   └── workers/                  # Background job workers
│       └── (future background processing)
│
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── eslint.config.js              # ESLint configuration
├── jest.config.cjs               # Jest testing configuration
├── .env                          # Environment variables (create)
└── .env.example                  # Environment template
```

---

## 🏗 Architecture

### Application Flow

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   HTTP Request  │───▶│   Express App    │───▶│   Route Handler │
│                 │    │   (app.ts)       │    │                 │
└─────────────────┘    └──────────────────┘    └─────────┬───────┘
                                                          │
                                                          ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  Middleware     │───▶│   Controller     │───▶│   Service       │
│  (Auth/Valid)   │    │   (Business Log) │    │   (External)    │
└─────────────────┘    └──────────────────┘    └─────────┬───────┘
                                                          │
                                                          ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Database      │◀───│   Model/ODM      │◀───│   Response      │
│   (MongoDB)     │    │   (Mongoose)     │    │   (JSON)        │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Request Processing Pipeline

1. **HTTP Request** → Express receives request
2. **Middleware Chain** → CORS, JSON parsing, authentication
3. **Route Matching** → Routes direct to appropriate controller
4. **Input Validation** → Zod schemas validate request data
5. **Business Logic** → Controller executes domain logic
6. **Data Operations** → Models interact with databases
7. **External Services** → API calls to HuggingFace, Jina AI, etc.
8. **Response** → JSON response sent to client

### Asynchronous Processing

```
Card Creation Request
        │
        ▼
   Controller (Sync)
   - Validate input
   - Create DB record
   - Return immediate response
        │
        ▼
   Background Service (Async)
   - Web scraping
   - Embedding generation
   - Vector storage
   - Status updates via SSE
```

---

## 🔌 API Reference

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication
All protected endpoints require JWT authentication via:
- **Cookie**: `token` (HTTP-only, secure)
- **Header**: `Authorization: Bearer <token>`

### Response Format
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Format
```json
{
  "success": false,
  "error": "Error message",
  "details": { ... }
}
```

### Endpoints Overview

#### Authentication (`/auth/`)
| Method | Endpoint | Description | Auth | Body |
|--------|----------|-------------|------|------|
| POST | `/signup` | User registration | ❌ | `{username, email, password}` |
| POST | `/login` | User login | ❌ | `{email, password}` |
| POST | `/logout` | User logout | ✅ | - |
| POST | `/forgot-password` | Request password reset | ❌ | `{email}` |
| POST | `/reset-password` | Reset password | ❌ | `{token, password}` |
| GET | `/google` | Google OAuth login | ❌ | - |
| GET | `/google/callback` | Google OAuth callback | ❌ | - |
| GET | `/github` | GitHub OAuth login | ❌ | - |
| GET | `/github/callback` | GitHub OAuth callback | ❌ | - |

#### Content Management (`/content/`)
| Method | Endpoint | Description | Auth | Body |
|--------|----------|-------------|------|------|
| GET | `/cards` | Get all user cards | ✅ | - |
| POST | `/card` | Create new card | ✅ | `{title, link, tags, type}` |
| PUT | `/editCard/:id` | Update card | ✅ | `{title?, link?, tags?, type?}` |
| DELETE | `/card/:id` | Delete card | ✅ | - |
| GET | `/metrics` | Get dashboard metrics | ✅ | - |
| POST | `/query` | Semantic search | ✅ | `{query, limit}` |

#### User Management (`/user/`)
| Method | Endpoint | Description | Auth | Body |
|--------|----------|-------------|------|------|
| GET | `/` | Get user profile | ✅ | - |
| PUT | `/profile` | Update profile | ✅ | `{username?, email?, avatar?}` |
| POST | `/userconfirmation` | Verify password | ✅ | `{password}` |

#### Sharing (`/brain/`)
| Method | Endpoint | Description | Auth | Body |
|--------|----------|-------------|------|------|
| POST | `/share` | Create share link | ✅ | `{cardIds}` |
| GET | `/:shareId` | Get shared cards | ❌ | - |

#### Verification (`/me`)
| Method | Endpoint | Description | Auth | Body |
|--------|----------|-------------|------|------|
| GET | `/` | Verify token & get user | ✅ | - |

#### Real-time (`/events`)
| Method | Endpoint | Description | Auth | Body |
|--------|----------|-------------|------|------|
| GET | `/` | SSE event stream | ✅ | - |

---

## 🔐 Authentication

### JWT Authentication

The server uses JSON Web Tokens for stateless authentication:

```typescript
// Token Structure
{
  "id": "user_mongodb_id",
  "iat": 1640995200,  // Issued at
  "exp": 1641081600   // Expires at (24 hours)
}
```

### Cookie Configuration
```typescript
{
  httpOnly: true,     // Prevents XSS attacks
  secure: true,       // HTTPS only in production
  sameSite: 'lax',    // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  domain: '.yourdomain.com'
}
```

### OAuth Integration

#### Google OAuth
- **Scopes**: `profile`, `email`
- **Strategy**: Passport Google OAuth 2.0
- **User Creation**: Automatic on first login

#### GitHub OAuth
- **Scopes**: `user:email`, `read:user`
- **Strategy**: Passport GitHub 2.0
- **User Creation**: Automatic on first login

### Password Security
- **Hashing**: bcrypt with 10 salt rounds
- **Minimum Length**: 8 characters
- **Complexity**: Alphanumeric + special characters recommended

---

## 📊 Data Models

### User Model (`models/User.ts`)

```typescript
interface IUser {
  _id: ObjectId;
  googleId?: string;          // Google OAuth ID
  githubId?: string;          // GitHub OAuth ID
  username: string;           // Display name
  email: string;              // Unique email
  password?: string;          // Hashed password (optional for OAuth)
  avatar?: string;            // Profile picture URL
  sharelink: string;          // Unique public share ID
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  googleId: String,
  githubId: String,
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: String,
  avatar: String,
  sharelink: { type: String, unique: true },
}, { timestamps: true });
```

### Content Model (`models/Content.ts`)

```typescript
interface IContent {
  _id: ObjectId;
  userId: ObjectId;           // Reference to User
  cardId: string;             // UUID for tracking
  title: string;              // Card title
  link: string;               // Original URL
  type: 'document' | 'video' | 'tweet' | 'link';
  tags: string[];             // Associated tags
  share: boolean;             // Public sharing enabled
  status: 'pending' | 'ready' | 'failed';
  embedding?: number[];       // 384-dimensional vector
  createdAt: Date;
  updatedAt: Date;
}

const ContentSchema = new Schema<IContent>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  cardId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  link: { type: String, required: true },
  type: { type: String, required: true, enum: ['document', 'video', 'tweet', 'link'] },
  tags: [{ type: String }],
  share: { type: Boolean, default: false },
  status: { type: String, default: 'pending', enum: ['pending', 'ready', 'failed'] },
  embedding: [{ type: Number }],
}, { timestamps: true });
```

### Tags Model (`models/Tags.ts`)

```typescript
interface ITag {
  _id: ObjectId;
  name: string;               // Tag name
  userId: ObjectId;           // Owner
  color?: string;             // Display color
  usageCount: number;         // Number of cards using this tag
}

const TagSchema = new Schema<ITag>({
  name: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  color: String,
  usageCount: { type: Number, default: 0 },
});
```

### Link Model (`models/Link.ts`)

```typescript
interface ILink {
  _id: ObjectId;
  url: string;                // Original URL
  title?: string;             // Scraped title
  description?: string;       // Meta description
  image?: string;             // Preview image
  content?: string;           // Scraped content
  lastScraped: Date;          // Last scraping timestamp
}

const LinkSchema = new Schema<ILink>({
  url: { type: String, required: true, unique: true },
  title: String,
  description: String,
  image: String,
  content: String,
  lastScraped: Date,
});
```

---

## 🗄️ Database Configuration

### MongoDB Setup

```typescript
// config/db.ts
import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI!);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
```

### Connection Options
- **Connection Pooling**: Automatic connection pooling
- **Retry Logic**: Built-in reconnection on failure
- **Indexes**: Optimized indexes on frequently queried fields
- **Validation**: Schema validation at database level

### Qdrant Setup

```typescript
// config/QdrantConfig.ts
import { QdrantClient } from '@qdrant/js-client-rest';

const qdrantClient = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
});

// Collection Configuration
const COLLECTION_NAME = 'Card';
const VECTOR_SIZE = 384; // HuggingFace embedding dimensions

export { qdrantClient, COLLECTION_NAME, VECTOR_SIZE };
```

### Vector Schema
```json
{
  "name": "Card",
  "vectors": {
    "size": 384,
    "distance": "Cosine"
  },
  "payload_schema": {
    "cardId": { "type": "keyword" },
    "userId": { "type": "keyword" },
    "title": { "type": "text" },
    "link": { "type": "text" },
    "tags": { "type": "keyword" }
  }
}
```

---

## 🛠 Services & Utilities

### Card Processing Service (`services/processor.ts`)

Asynchronous background processing for newly created cards:

```typescript
export const processCard = async (
  cardId: string,
  userId: string,
  title: string,
  link: string
): Promise<void> => {
  try {
    // 1. Send processing start event
    sseManager.sendEvent(userId, 'startCardProcessing', {
      cardId,
      message: 'Processing card...'
    });

    // 2. Scrape webpage content
    const scrapedContent = await scrapeLink(link);

    // 3. Generate embeddings
    const embedding = await getEmbedding(`${title} ${scrapedContent}`);

    // 4. Store in vector database
    await storeInQdrant(cardId, userId, embedding, { title, link });

    // 5. Update card status
    await Content.findOneAndUpdate(
      { cardId },
      { status: 'ready', embedding }
    );

    // 6. Send completion event
    sseManager.sendEvent(userId, 'cardProcessed', {
      cardId,
      title,
      message: 'Card processing complete'
    });

  } catch (error) {
    // Handle errors
    await Content.findOneAndUpdate(
      { cardId },
      { status: 'failed' }
    );

    sseManager.sendEvent(userId, 'cardFailed', {
      cardId,
      error: error.message
    });
  }
};
```

### Embedding Service (`utils/embeddings.ts`)

HuggingFace API integration for text embeddings:

```typescript
export const getEmbedding = async (text: string): Promise<number[]> => {
  const response = await axios.post(
    'https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2',
    { inputs: text },
    {
      headers: {
        'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    }
  );

  return response.data[0]; // 384-dimensional vector
};
```

### Web Scraping (`utils/scrape.ts`)

Jina AI integration for content extraction:

```typescript
export const scrapeLink = async (url: string): Promise<string> => {
  const response = await axios.get(
    `https://r.jina.ai/${url}`,
    {
      headers: {
        'Authorization': `Bearer ${process.env.JINA_API_KEY}`,
        'X-Return-Format': 'text'
      }
    }
  );

  return response.data.content;
};
```

### Qdrant Utilities (`utils/qDrant.ts`)

Vector database operations:

```typescript
export const storeInQdrant = async (
  cardId: string,
  userId: string,
  vector: number[],
  payload: object
): Promise<void> => {
  await qdrantClient.upsert(COLLECTION_NAME, {
    points: [{
      id: cardId,
      vector,
      payload: { cardId, userId, ...payload }
    }]
  });
};

export const searchQdrant = async (
  queryVector: number[],
  userId: string,
  limit: number = 10
) => {
  const results = await qdrantClient.search(COLLECTION_NAME, {
    vector: queryVector,
    filter: {
      must: [{ key: 'userId', match: { value: userId } }]
    },
    limit,
    with_payload: true,
    with_vector: false
  });

  return results;
};
```

### Email Service (`utils/resetPasswordTemplate.ts`)

Nodemailer configuration for password reset emails:

```typescript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export const sendPasswordResetEmail = async (
  email: string,
  resetToken: string
): Promise<void> => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset - Second Brain',
    html: generateResetEmailTemplate(resetUrl)
  });
};
```

---

## ⚡ Real-time Features

### Server-Sent Events (SSE)

The server provides real-time updates using Server-Sent Events:

```typescript
// routes/eventRoutes.ts
import express from 'express';
import { sseManager } from '../utils/sseManager';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  // Set SSE headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': process.env.FRONTEND_URL,
    'Access-Control-Allow-Credentials': 'true'
  });

  // Add client to manager
  sseManager.addClient(req.user.id, res);

  // Handle client disconnect
  req.on('close', () => {
    sseManager.removeClient(req.user.id);
  });
});

export default router;
```

### SSE Manager (`utils/sseManager.ts`)

Manages SSE connections and event broadcasting:

```typescript
class SSEManager {
  private clients: Map<string, Response> = new Map();

  addClient(userId: string, res: Response): void {
    this.clients.set(userId, res);
  }

  removeClient(userId: string): void {
    const res = this.clients.get(userId);
    if (res) {
      res.end();
      this.clients.delete(userId);
    }
  }

  sendEvent(userId: string, event: string, data: any): void {
    const res = this.clients.get(userId);
    if (res) {
      res.write(`event: ${event}\n`);
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    }
  }

  // Send keepalive every 15 seconds
  startKeepalive(): void {
    setInterval(() => {
      this.clients.forEach((res) => {
        res.write(':keepalive\n\n');
      });
    }, 15000);
  }
}

export const sseManager = new SSEManager();
```

### Event Types

| Event | Data | Description |
|-------|------|-------------|
| `startCardProcessing` | `{cardId, message}` | Card processing started |
| `cardProcessed` | `{cardId, title, message}` | Card processing completed |
| `cardFailed` | `{cardId, error}` | Card processing failed |
| `:keepalive` | - | Connection keepalive |

---

## 🔒 Security

### Authentication Security
- **JWT Expiration**: 7-day token expiration
- **Secure Cookies**: HTTP-only, secure, sameSite protection
- **Password Hashing**: bcrypt with salt rounds
- **OAuth State**: CSRF protection for OAuth flows

### API Security
- **Input Validation**: Zod schema validation on all inputs
- **Rate Limiting**: Consider implementing rate limiting
- **CORS**: Configured for specific frontend domains
- **Helmet**: Security headers middleware

### Data Security
- **Encryption**: Passwords hashed with bcrypt
- **Data Sanitization**: Input sanitization and validation
- **Access Control**: User-scoped data access
- **Audit Logging**: Request logging for security monitoring

### Environment Security
- **Secret Management**: All secrets in environment variables
- **No Hardcoded Secrets**: Never commit secrets to code
- **Environment Separation**: Different configs for dev/prod

---

## 🚀 Deployment

### Production Checklist
- [ ] Environment variables configured
- [ ] MongoDB connection string updated
- [ ] Qdrant instance running
- [ ] External API keys obtained
- [ ] OAuth callback URLs updated
- [ ] SSL certificates configured
- [ ] Domain configured

### Build Process
```bash
# Build for production
npm run build

# Start production server
NODE_ENV=production node dist/server.js
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist/ ./dist/
EXPOSE 5000
CMD ["node", "dist/server.js"]
```

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://yourdomain.com
MONGO_URI=mongodb+srv://...
QDRANT_URL=https://your-qdrant-instance.com
# ... other production values
```

### Process Management
- **PM2**: Process manager for production
- **Health Checks**: Implement health check endpoints
- **Logging**: Structured logging with Winston
- **Monitoring**: Application performance monitoring

---

## 🧪 Testing

### Test Setup
```typescript
// jest.config.cjs
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/server.ts',
    '!src/**/*.d.ts'
  ]
};
```

### Running Tests
```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- authController.test.ts
```

### Test Structure
```
src/
├── __tests__/
│   ├── controllers/
│   │   ├── authController.test.ts
│   │   └── cardController.test.ts
│   ├── utils/
│   │   ├── embeddings.test.ts
│   │   └── scrape.test.ts
│   └── integration/
│       └── api.test.ts
```

### Example Test
```typescript
// controllers/authController.test.ts
import request from 'supertest';
import app from '../../app';

describe('Auth Controller', () => {
  describe('POST /signup', () => {
    it('should create a new user', async () => {
      const response = await request(app)
        .post('/api/v1/auth/signup')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });
  });
});
```

---

## 🔧 Troubleshooting

### Common Issues

#### Database Connection Issues
**Problem**: MongoDB connection fails
**Solutions**:
- Verify `MONGO_URI` in environment
- Check MongoDB server is running
- Ensure network connectivity
- Validate user credentials

#### Qdrant Connection Issues
**Problem**: Vector database operations fail
**Solutions**:
- Verify `QDRANT_URL` and `QDRANT_API_KEY`
- Check Qdrant service is running
- Ensure collection exists
- Validate API key permissions

#### Authentication Issues
**Problem**: JWT verification fails
**Solutions**:
- Check `JWT_SECRET` is set correctly
- Verify token hasn't expired
- Ensure cookies are being sent
- Check CORS configuration

#### External API Issues
**Problem**: HuggingFace/Jina AI calls fail
**Solutions**:
- Verify API keys are correct
- Check API rate limits
- Ensure internet connectivity
- Validate request format

#### SSE Connection Issues
**Problem**: Real-time events not working
**Solutions**:
- Check CORS headers for `/events` route
- Verify authentication middleware
- Ensure client properly handles SSE
- Check network/firewall settings

### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm run dev

# Check environment variables
console.log(process.env);
```

### Performance Issues
- **Database Queries**: Add indexes on frequently queried fields
- **API Calls**: Implement caching for external services
- **Memory Usage**: Monitor for memory leaks
- **Concurrent Connections**: Adjust connection pool sizes

---

## 🤝 Contributing

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature`
3. **Make** changes with proper TypeScript types
4. **Add** tests for new functionality
5. **Run** tests and linting: `npm test && npm run lint`
6. **Commit** with conventional format
7. **Push** and create Pull Request

### Code Standards

- **TypeScript**: Strict mode, no `any` types
- **ESLint**: All rules must pass
- **Prettier**: Code formatted automatically
- **Testing**: Minimum 80% code coverage
- **Documentation**: JSDoc comments for public APIs

### API Design Guidelines

- **RESTful**: Follow REST conventions
- **Versioning**: API versioning with `/v1/` prefix
- **Status Codes**: Proper HTTP status codes
- **Error Handling**: Consistent error response format
- **Validation**: Input validation on all endpoints

### Security Guidelines

- **Input Validation**: Validate all user inputs
- **Authentication**: Protect sensitive endpoints
- **Authorization**: Check user permissions
- **Data Sanitization**: Clean user-provided data
- **Secrets**: Never commit sensitive data

---

## 📄 License

This project is part of the Second Brain application. See the main repository for licensing information.

---

*For frontend documentation, see the [Client README](../client/README.md)*

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

