# Client (Frontend) - Second Brain

A React + TypeScript + Vite application for managing and organizing your personal knowledge base with AI-powered semantic search capabilities.

## 📋 Quick Navigation

- [Folder Structure](#-folder-structure)
- [Tech Stack](#-tech-stack)
- [Architecture Overview](#-architecture-overview)
- [API Integration](#-api-integration)
- [State Management](#-state-management)
- [Components](#-components)
- [Pages/Routes](#-pagesroutes)
- [Getting Started](#-getting-started)

---

## 📁 Folder Structure

```
client/
├── src/
│   ├── App.tsx                 # Main app router setup
│   ├── main.tsx                # Entry point (React + Recoil + Router)
│   ├── index.css               # Global styles
│   ├── App.css                 # App component styles
│   │
│   ├── components/             # Reusable UI components
│   │   ├── AddCard.tsx         # Modal to add new cards
│   │   ├── Card.tsx            # Individual card component with edit/delete
│   │   ├── Loading.tsx         # Loading spinner overlay
│   │   ├── Protected.tsx       # Route protection wrapper
│   │   ├── ShareModal.tsx      # Share link generation modal
│   │   └── Sidebar.tsx         # Navigation sidebar
│   │
│   ├── pages/                  # Full page components
│   │   ├── AuthPages.tsx       # Login/Signup page
│   │   ├── Cards.tsx           # All cards view with search
│   │   ├── Dashboard.tsx       # Home dashboard with metrics
│   │   ├── LandingPage.tsx     # Public landing page
│   │   ├── Profile.tsx         # User profile management
│   │   ├── ResetPassword.tsx   # Password reset page
│   │   ├── Search.tsx          # AI semantic search page
│   │   ├── Share.tsx           # Public share page view
│   │   └── Tags.tsx            # Filter cards by tags
│   │
│   ├── layouts/
│   │   └── DashboardLayout.tsx # Main dashboard layout wrapper
│   │
│   ├── context/
│   │   └── AuthContext.tsx     # Authentication context provider
│   │
│   ├── store/
│   │   └── atoms/              # Recoil state management
│   │       ├── allcards.ts     # All user cards state
│   │       ├── counter.ts      # Generic counter
│   │       ├── editcard.ts     # Currently editing card data
│   │       ├── formData.ts     # Form input data
│   │       ├── hideIcons.ts    # Toggle icon visibility
│   │       ├── loading.ts      # Global loading state
│   │       ├── modal.ts        # Add card modal state
│   │       ├── resetpassword.ts# Password reset form data
│   │       ├── search.ts       # Search input state
│   │       ├── searchModal.ts  # AI search modal state
│   │       ├── sharelink.ts    # Share link state
│   │       ├── sidebar.ts      # Sidebar open/close
│   │       └── signupform.ts   # Signup form data
│   │
│   ├── utils/
│   │   └── handleError.ts      # Centralized error handling
│   │
│   ├── assets/                 # Static assets
│   └── context/
│
├── index.html                  # HTML entry point
├── package.json                # Dependencies & scripts
├── vite.config.ts             # Vite configuration
├── tsconfig.json              # TypeScript config
└── .env                        # Environment variables
```

---

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | React 18.3 |
| **Language** | TypeScript |
| **Build Tool** | Vite |
| **Styling** | Tailwind CSS + Lucide React icons |
| **State Management** | Recoil |
| **Routing** | React Router v7 |
| **HTTP Client** | Axios |
| **Auth** | JWT (via cookies) |
| **Notifications** | React Hot Toast |
| **Animation** | Motion (Framer Motion alternative) |

---

## 🏗 Architecture Overview

### Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        App.tsx (Router)                     │
└────────────┬────────────────────────────────────────────────┘
             │
      ┌──────▼──────┐
      │  Protected  │ (Route guard - checks auth)
      └──────┬──────┘
             │
      ┌──────▼────────────────┐
      │  DashboardLayout      │ (Main layout with Sidebar)
      └──────┬────────────────┘
             │
    ┌────────┼────────┐
    │        │        │
┌───▼──┐ ┌──▼──┐ ┌───▼───┐
│Pages │ │Auth │ │Public │
└──────┘ └─────┘ └───────┘
    │
    └─────────────────────┐
                          │
              ┌───────────▼──────────────┐
              │    Recoil Atoms          │
              │ (Global State Management)│
              └───────────┬──────────────┘
                          │
              ┌───────────▼──────────────┐
              │    Axios API Calls       │
              │  (Backend Integration)   │
              └──────────────────────────┘
```

### Request/Response Flow

1. **User Action** (e.g., click "Add Card") → 
2. **Component Handler** → 
3. **Recoil State Update** → 
4. **API Call** (Axios) with JWT token → 
5. **Backend Processing** → 
6. **Response Handling** (success/error toast) → 
7. **State Update** → 
8. **Component Re-render**

---

## 🔌 API Integration

### Base URL
```typescript
const backendUrl = import.meta.env.VITE_BACKEND_URL;
// Defaults to http://localhost:3000 or your deployed backend
```

### Authentication
- **JWT Token Storage**: Stored in HTTP-only cookies (secure)
- **Token Retrieval**: `Cookies.get('token')` from `js-cookie`
- **Auth Context**: Centralized login/logout/verify logic in `AuthContext.tsx`

### API Endpoints Called

#### **Authentication** (`/api/v1/auth/`)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/login` | User login |
| POST | `/logout` | User logout |
| POST | `/signup` | User registration |
| POST | `/forgetPassword` | Password reset request |
| POST | `/resetPassword/:token` | Password reset confirmation |
| GET | `/google` | Google OAuth login |
| GET | `/google/callback` | Google OAuth callback |

**Called from**: `AuthContext.tsx`, `AuthPages.tsx`, `ResetPassword.tsx`

```typescript
// Example: Login API call
await axios.post(`${backendUrl}/api/v1/auth/login`, 
  { email, password }, 
  { withCredentials: true }
);
```

---

#### **Cards Management** (`/api/v1/content/`)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/cards` | Fetch all user cards |
| POST | `/card` | Create new card |
| PUT | `/editCard/:id` | Update existing card |
| DELETE | `/card/:id` | Delete a card |
| GET | `/metrics` | Fetch dashboard stats |
| POST | `/query` | AI semantic search |

**Called from**: `Cards.tsx`, `Dashboard.tsx`, `Search.tsx`, `Card.tsx`, `AddCard.tsx`

```typescript
// Example: Fetch all cards
const res = await axios.get(`${backendUrl}/api/v1/content/cards`, {
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});

// Example: Create card with tags
await axios.post(`${backendUrl}/api/v1/content/card`, 
  { title, link, tags, type }, 
  { headers: { Authorization: `Bearer ${token}` } }
);

// Example: AI Search
const res = await axios.post(
  `${backendUrl}/api/v1/content/query`,
  { query: "search term", limit: 5 },
  { headers: { Authorization: `Bearer ${token}` } }
);
```

---

#### **User Profile** (`/api/v1/user/`)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/` | Fetch user profile |
| POST | `/userconfirmation` | Verify password before changes |
| PUT | `/profile` | Update user profile (avatar, email, etc.) |

**Called from**: `Profile.tsx`, `AuthContext.tsx` (via `/api/v1/me`)

```typescript
// Example: Get user profile
const res = await axios.get(`${backendUrl}/api/v1/user/`, {
  headers: { Authorization: `Bearer ${token}` },
});

// Example: Update profile
await axios.put(`${backendUrl}/api/v1/user/profile`, 
  { username, avatar }, 
  { headers: { Authorization: `Bearer ${token}` } }
);
```

---

#### **Share/Public Brain** (`/api/v1/brain/`)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/:shareId` | Fetch shared cards (public) |
| POST | `/share` | Create share link |

**Called from**: `Share.tsx`, `ShareModal.tsx`

```typescript
// Example: Fetch public shared cards
const res = await axios.get(`${backendUrl}/api/v1/brain/${shareId}`);

// Example: Create share link
const res = await axios.post(
  `${backendUrl}/api/v1/brain/share`,
  { cardIds: [...] },
  { headers: { Authorization: `Bearer ${token}` } }
);
```

---

#### **User Verification** (`/api/v1/me`)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/` | Verify auth token & get user info |

**Called from**: `Protected.tsx`, `AuthContext.tsx` (on app mount)

```typescript
// Used to check if user is still authenticated
const res = await axios.get(`${backendUrl}/api/v1/me`, {
  withCredentials: true
});
```

---

#### **Real-time Events (SSE)** (`/events`)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/events` | Server-Sent Events for card processing |

**Event Types Listened**:
- `startCardProcessing` - Card is being processed
- `cardProcessed` - Card processing completed
- `cardFailed` - Card processing failed

**Called from**: `Cards.tsx`

```typescript
// Open SSE connection to listen for real-time updates
const es = new EventSource(`${backendUrl}/events`, {
  withCredentials: true,
});

es.addEventListener("cardProcessed", (e) => {
  const data = JSON.parse(e.data);
  toast.success(data.message);
});
```

---

## 🎯 State Management (Recoil)

All global state is managed using **Recoil atoms** stored in `src/store/atoms/`:

| Atom | Type | Purpose |
|------|------|---------|
| `allcardsAtom` | `Card[]` | All user cards |
| `modalAtom` | `boolean` | Add card modal open/close |
| `loadingAtom` | `boolean` | Global loading state |
| `sidebarAtom` | `boolean` | Sidebar open/close |
| `editCardAtom` | `Card \| null` | Card being edited |
| `formdataAtom` | `FormData` | Form input values |
| `search.ts` | `string` | Search input |
| `searchModalAtom` | `boolean` | AI search modal state |
| `sharelink.ts` | `string` | Generated share link |
| `signupform.ts` | `FormData` | Signup form values |
| `hideIconAtom` | `boolean` | Toggle card action icons |

### Example Usage
```typescript
import { useRecoilValue, useSetRecoilState } from "recoil";
import { allcardsAtom } from "../store/atoms/allcards";

function MyComponent() {
  const allCards = useRecoilValue(allcardsAtom);      // Read
  const setAllCards = useSetRecoilState(allcardsAtom); // Write
  
  const updateCards = () => {
    setAllCards([...allCards, newCard]);
  };
  
  return <div>{allCards.length} cards</div>;
}
```

---

## 🧩 Components

### Layout Components

#### `DashboardLayout.tsx`
- Main wrapper for authenticated pages
- Contains sidebar and outlet for nested routes
- Structure:
  ```
  ┌─────────────────────────────┐
  │  Sidebar  │  Outlet (Pages) │
  │           │                 │
  │  - Home   │ Content renders │
  │  - Cards  │ here            │
  │  - Tags   │                 │
  │  - Search │                 │
  │  - Profile│                 │
  └─────────────────────────────┘
  ```

#### `Protected.tsx`
- Route guard component
- Checks `AuthContext.authenticated` before rendering
- Redirects to login if not authenticated

### Feature Components

#### `Card.tsx` - Individual Card Display
- **Props**: Card data (title, link, tags, type)
- **Features**: 
  - Edit card
  - Delete card
  - Open link externally
  - Show share status (public/private)
  - Tags display
  - Type icon (document/video/tweet/link)
- **API Calls**: Delete, edit

#### `AddCard.tsx` - Add/Edit Card Modal
- Form inputs for: title, link, tags, type
- Auto-extracts domain name from link
- Supports adding multiple tags
- **API Calls**: Create or update card
- Real-time validation

#### `ShareModal.tsx` - Generate Share Links
- Creates public share links for cards
- Copy-to-clipboard functionality
- **API Calls**: Create share link

#### `Sidebar.tsx` - Navigation
- Navigation links to all pages
- User profile dropdown
- Logout button
- Responsive toggle

#### `Loading.tsx` - Loading Overlay
- Full-screen loading spinner
- Blocks interaction during API calls

---

## 📄 Pages/Routes

### Route Structure
```typescript
/                          → LandingPage (public)
/auth                      → AuthPages (login/signup)
/:id                       → Share (public shared cards)
/reset-password/:token     → ResetPassword

Protected Routes (require authentication):
/home/dashboard            → Dashboard (home page)
/home/tags                 → Tags (filter by tag)
/home/cards                → Cards (all cards view)
/home/search               → Search (AI semantic search)
/home/profile              → Profile (user settings)
```

### Page Details

#### `AuthPages.tsx` - Authentication
- Toggle between login and signup
- Email/password validation
- Google OAuth integration link
- **API Calls**: `POST /auth/login`, `POST /auth/signup`

#### `Dashboard.tsx` - Home Dashboard
- **Displays**:
  - Total cards count with trend
  - Total tags with trend
  - AI searches count
  - Cards added this week
  - Weekly activity chart
  - Top tags
  - Recent cards list
- **API Calls**: `GET /content/metrics`
- Uses real-time event updates via SSE

#### `Cards.tsx` - All Cards View
- Displays all user cards
- Search/filter by title (client-side)
- Add new card button
- Share cards button
- **API Calls**:
  - `GET /content/cards` (fetch all)
  - `GET /events` (SSE for processing updates)
- Listens to SSE events for card processing status

#### `Tags.tsx` - Filter by Tags
- Multi-select tag filter dropdown
- Shows cards matching selected tags
- Search within filtered cards
- Tag grouping and counting

#### `Search.tsx` - AI Semantic Search
- **Features**:
  - Natural language query input
  - Adjustable result limit (1-20)
  - AI-powered vector search
  - Displays relevant cards with similarity
- **API Calls**: `POST /content/query` (semantic search)

#### `Profile.tsx` - User Settings
- Update username, email, avatar
- Change password
- Requires password verification
- **API Calls**:
  - `GET /user/` (fetch profile)
  - `POST /user/userconfirmation` (verify password)
  - `PUT /user/profile` (update profile)

#### `Share.tsx` - Public Share Page
- View publicly shared cards
- Public page (no auth required)
- Shows card details, tags, links
- **API Calls**: `GET /brain/:shareId`

#### `ResetPassword.tsx` - Password Reset
- Token-based password reset form
- **API Calls**: `POST /auth/resetPassword/:token`

---

## ⚙️ Getting Started

### Installation
```bash
cd client
npm install
```

### Environment Setup
Create `.env` file:
```env
VITE_BACKEND_URL=http://localhost:3000
# or for production:
VITE_BACKEND_URL=https://your-backend-url.com
```

### Development
```bash
npm run dev
# Starts Vite dev server on http://localhost:5173
```

### Build
```bash
npm run build
# Compiles TypeScript and bundles with Vite
```

### Lint & Format
```bash
npm run lint          # Run ESLint
npm run format        # Format with Prettier
```

---

## 🔄 Common Workflows

### Adding a New Card
1. User clicks "+" button in Cards page → `AddCard.tsx` modal opens
2. User fills form (title, link, tags) → triggers validation
3. On submit → `POST /api/v1/content/card` API call
4. Backend processes card (scrapes title, generates embeddings)
5. SSE event `startCardProcessing` → toast notification
6. SSE event `cardProcessed` → card added to `allcardsAtom`
7. Cards component re-renders with new card

### Searching Cards
1. User types in search box (Cards page) → updates local search state
2. Component filters `allcardsAtom` client-side by title match
3. Display updates in real-time

### AI Semantic Search
1. User enters natural language query in Search page
2. On submit → `POST /api/v1/content/query` with query + limit
3. Backend generates embeddings and searches vector DB
4. Returns ranked results based on semantic similarity
5. Display results with relevance scores

### User Authentication Flow
1. User enters email/password → AuthPages form
2. On submit → `POST /api/v1/auth/login`
3. Backend validates & returns JWT in cookie
4. `AuthContext.verifyUser()` updates auth state
5. User redirected to `/home/dashboard`
6. All subsequent requests include JWT automatically via cookies

---

## 🐛 Error Handling

Centralized error handling utility in `utils/handleError.ts`:
```typescript
export const handleError = (err: unknown, fallbackMessage?: string) => {
  if (axios.isAxiosError(err)) {
    const message = err.response?.data?.message || fallbackMessage;
    toast.error(message); // Show error toast
  }
};
```

Used throughout components:
```typescript
try {
  const res = await axios.get(...);
  // handle success
} catch (err) {
  handleError(err, "Failed to fetch data");
}
```

---

## 📝 Notes

- **CORS**: Backend configured to accept requests from frontend domain
- **Credentials**: `withCredentials: true` enables cookie-based auth
- **Token Refresh**: Handled via `verifyUser()` on app mount and auth state changes
- **Loading States**: Global `loadingAtom` prevents duplicate requests
- **Real-time Updates**: SSE for card processing feedback without polling

---

## 🚀 Quick Links

- [Backend Routes Documentation](../server/src/routes/)
- [API Endpoints](../server/src/controllers/)
- [Recoil Atoms](src/store/atoms/)
- [Components](src/components/)
- [Pages](src/pages/)
