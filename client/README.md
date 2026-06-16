# Second Brain Client (Frontend)

A modern, responsive React-based frontend application for managing personal knowledge bases with AI-powered semantic search capabilities. This client provides a user-friendly interface to organize, search, and share digital content like articles, videos, tweets, and documents.

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Available Scripts](#-available-scripts)
- [Project Structure](#-project-structure)
- [Architecture](#-architecture)
- [State Management](#-state-management)
- [Components](#-components)
- [Pages & Routing](#-pages--routing)
- [API Integration](#-api-integration)
- [Styling & UI](#-styling--ui)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Project Overview

Second Brain is a personal knowledge management application that allows users to save, organize, and retrieve information from various sources. The client-side application provides:

- **Content Management**: Save links, articles, videos, and tweets
- **AI-Powered Search**: Semantic search using vector embeddings
- **Organization**: Tag-based categorization and filtering
- **Sharing**: Public share links for selected content
- **Real-time Updates**: Live processing status via Server-Sent Events
- **Responsive Design**: Works seamlessly on desktop and mobile devices

The application follows a modern React architecture with TypeScript, using Recoil for state management and Tailwind CSS for styling.

---

## ✨ Features

### Core Functionality
- **User Authentication**: Secure login/signup with JWT and Google OAuth
- **Card Management**: Create, edit, delete, and organize content cards
- **Semantic Search**: AI-powered search using natural language queries
- **Tag System**: Organize content with customizable tags
- **Public Sharing**: Generate shareable links for content collections
- **Dashboard Analytics**: View usage statistics and trends
- **Real-time Processing**: Live updates during content processing

### User Experience
- **Responsive Design**: Optimized for all screen sizes
- **Dark/Light Theme**: Theme toggle with system preference detection
- **Loading States**: Smooth loading indicators and skeleton screens
- **Error Handling**: Comprehensive error messages and recovery
- **Toast Notifications**: User-friendly feedback for all actions
- **Keyboard Navigation**: Full keyboard accessibility support

### Technical Features
- **Type-Safe**: Full TypeScript implementation
- **Performance Optimized**: Lazy loading, code splitting, and efficient re-renders
- **SEO Friendly**: Proper meta tags and semantic HTML
- **PWA Ready**: Service worker and manifest configuration
- **Cross-browser Compatible**: Tested on modern browsers

---

## 🛠 Tech Stack

### Core Framework
- **React 18.3**: Modern React with concurrent features and hooks
- **TypeScript 5.9**: Type-safe JavaScript with strict configuration
- **Vite 5.x**: Fast build tool with HMR and optimized bundling

### State Management
- **Recoil 0.7.7**: Facebook's state management library for React
- **React Context**: Authentication and theme context providers

### UI & Styling
- **Tailwind CSS 4.1**: Utility-first CSS framework
- **Lucide React**: Modern icon library
- **Motion 12.x**: Animation library for smooth transitions
- **React Hot Toast**: Toast notification system

### HTTP & Data
- **Axios 1.12**: HTTP client with interceptors and error handling
- **JS-Cookie 3.0**: Secure cookie management for authentication

### Development Tools
- **ESLint 9.x**: Code linting with React and TypeScript rules
- **Prettier 3.x**: Code formatting
- **TypeScript ESLint**: TypeScript-specific linting rules

### Build & Deployment
- **Vite Plugin React**: React-specific Vite optimizations
- **Vercel**: Deployment platform with automatic builds

---

## 📋 Prerequisites

Before running the client application, ensure you have:

- **Node.js**: Version 18.x or higher
- **npm**: Version 8.x or higher (comes with Node.js)
- **Backend Server**: The Second Brain backend API running (see server README)

### System Requirements
- **RAM**: Minimum 4GB, recommended 8GB
- **Storage**: 500MB free space for node_modules
- **Network**: Internet connection for API calls and dependencies

---

## 🚀 Installation & Setup

### 1. Clone and Navigate
```bash
# Navigate to the client directory
cd client
```

### 2. Install Dependencies
```bash
npm install
```
This will install all dependencies listed in `package.json`.

### 3. Environment Configuration
Create a `.env` file in the client root directory:

```env
# Backend API URL
VITE_BACKEND_URL=http://localhost:3000

# For production deployment
# VITE_BACKEND_URL=https://your-backend-domain.com
```

**Environment Variables Explained:**
- `VITE_BACKEND_URL`: The base URL of the Second Brain backend API
- All Vite environment variables must be prefixed with `VITE_` to be accessible in the client code

### 4. Start Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:5173`

### 5. Build for Production
```bash
npm run build
```
This creates an optimized build in the `dist/` directory.

---

## 📜 Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `vite` | Start development server with hot reload |
| `build` | `tsc -b && vite build` | Type-check and build for production |
| `lint` | `eslint .` | Run ESLint for code quality checks |
| `preview` | `vite preview` | Preview the production build locally |
| `format` | `prettier --write "src/**/*.{ts,tsx,js,jsx,json,css,md}"` | Format code with Prettier |

### Script Details

#### Development Server (`npm run dev`)
- Starts Vite dev server on port 5173
- Enables hot module replacement (HMR)
- Provides fast refresh for React components
- Includes source maps for debugging

#### Build Process (`npm run build`)
- Runs TypeScript compiler for type checking
- Bundles code with Vite for optimal performance
- Minifies CSS and JavaScript
- Generates static assets with hashed filenames

#### Linting (`npm run lint`)
- Checks code against ESLint rules
- Includes React, TypeScript, and accessibility rules
- Reports errors and warnings in the terminal

---

## 📁 Project Structure

```
client/
├── public/                    # Static assets served directly
│   ├── favicon.ico           # Browser favicon
│   └── robots.txt            # Search engine crawling rules
│
├── src/                      # Source code
│   ├── assets/              # Imported assets (images, fonts)
│   │   └── react.svg        # React logo asset
│   │
│   ├── components/          # Reusable UI components
│   │   ├── AddCard.tsx      # Modal for creating/editing cards
│   │   ├── Card.tsx         # Individual card display component
│   │   ├── CardSkeleton.tsx # Loading skeleton for cards
│   │   ├── DashboardSkeleton.tsx # Dashboard loading skeleton
│   │   ├── DeletConfirmation.tsx # Delete confirmation dialog
│   │   ├── Loading.tsx      # Global loading overlay
│   │   ├── Pagination.tsx   # Pagination component
│   │   ├── Protected.tsx    # Route protection wrapper
│   │   ├── SearchResultsSkeleton.tsx # Search results skeleton
│   │   ├── SectionsNav.tsx  # Section navigation component
│   │   ├── ShareModal.tsx   # Share link generation modal
│   │   ├── Sidebar.tsx      # Main navigation sidebar
│   │   └── ThemeToggle.tsx  # Dark/light theme toggle
│   │
│   ├── context/             # React Context providers
│   │   ├── AuthContext.tsx  # Authentication state management
│   │   └── ThemeContext.tsx # Theme state management
│   │
│   ├── layouts/             # Layout components
│   │   ├── DashboardLayout.tsx # Main dashboard layout
│   │   └── Layout.tsx       # Root layout component
│   │
│   ├── pages/               # Page-level components
│   │   ├── AuthPages.tsx    # Login and signup pages
│   │   ├── Cards.tsx        # Cards management page
│   │   ├── Dashboard.tsx    # Home dashboard
│   │   ├── LandingPage.tsx  # Public landing page
│   │   ├── MoveCards.tsx    # Move cards between sections
│   │   ├── ResetPassword.tsx # Password reset page
│   │   ├── Search.tsx       # AI search page
│   │   ├── Section.tsx      # Section-specific page
│   │   ├── Share.tsx        # Public share page
│   │   └── Tags.tsx         # Tag filtering page
│   │
│   ├── store/               # State management
│   │   └── atoms/           # Recoil atoms
│   │       ├── allcards.ts  # All user cards state
│   │       ├── counter.ts   # Generic counter atom
│   │       ├── deleteSection.ts # Section deletion state
│   │       ├── editcard.ts  # Card editing state
│   │       ├── formData.ts  # Form data state
│   │       ├── hideIcons.ts # Icon visibility toggle
│   │       ├── loading.ts   # Global loading state
│   │       ├── modal.ts     # Modal open/close state
│   │       ├── resetpassword.ts # Password reset state
│   │       ├── search.ts    # Search input state
│   │       ├── searchModal.ts # Search modal state
│   │       └── ...          # Additional atoms
│   │
│   ├── ui-compo/            # UI-specific components
│   │   ├── CardUI.tsx       # Card UI wrapper
│   │   ├── SectionCard.tsx  # Section card component
│   │   └── StatCard.tsx     # Statistics card component
│   │
│   ├── utils/               # Utility functions
│   │   └── handleError.ts   # Centralized error handling
│   │
│   ├── App.tsx              # Main app component with routing
│   ├── App.css              # App-specific styles
│   ├── AuthSuccess.tsx      # Authentication success component
│   ├── index.css            # Global CSS styles
│   └── main.tsx             # Application entry point
│
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── tsconfig.app.json        # App-specific TypeScript config
├── tsconfig.node.json       # Node-specific TypeScript config
├── vite.config.ts           # Vite build configuration
├── vercel.json              # Vercel deployment config
├── eslint.config.js         # ESLint configuration
└── tailwind.config.js       # Tailwind CSS configuration
```

---

## 🏗 Architecture

### Application Flow

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   User Action   │───▶│  Component       │───▶│  State Update   │
│                 │    │  Handler         │    │  (Recoil)       │
└─────────────────┘    └──────────────────┘    └─────────┬───────┘
                                                          │
                                                          ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   API Call      │───▶│  Backend         │───▶│  Response       │
│   (Axios)       │    │  Processing      │    │  Handling       │
└─────────────────┘    └──────────────────┘    └─────────┬───────┘
                                                          │
                                                          ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   UI Update     │◀───│  State Update   │◀───│  Toast/Loading  │
│                 │    │  (Recoil)       │    │  Feedback        │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Component Hierarchy

```
App (Router)
├── Layout (Root wrapper)
│   ├── LandingPage (Public)
│   └── Protected (Auth guard)
│       └── DashboardLayout (Authenticated wrapper)
│           ├── Sidebar (Navigation)
│           └── Outlet (Page content)
│               ├── Dashboard
│               ├── Cards
│               ├── Search
│               ├── Tags
│               └── Profile
```

### Data Flow Patterns

1. **User Interaction** → Component event handler
2. **State Update** → Recoil atom setter
3. **API Request** → Axios with JWT authentication
4. **Response Processing** → Error handling and state updates
5. **UI Re-render** → React's reconciliation based on state changes

---

## 🎯 State Management

The application uses **Recoil** for global state management, organized into atoms stored in `src/store/atoms/`.

### Core Atoms

| Atom | Type | Purpose | Usage |
|------|------|---------|-------|
| `allcardsAtom` | `Card[]` | Stores all user cards | Cards display, search, filtering |
| `loadingAtom` | `boolean` | Global loading state | Loading overlays, disabled states |
| `modalAtom` | `boolean` | Add card modal state | Modal open/close |
| `sidebarAtom` | `boolean` | Sidebar visibility | Responsive navigation |
| `editCardAtom` | `Card \| null` | Currently editing card | Edit modal data |
| `searchAtom` | `string` | Search input value | Real-time filtering |
| `authAtom` | `AuthState` | Authentication state | Route protection |
| `themeAtom` | `Theme` | Current theme | Dark/light mode |

### State Usage Example

```typescript
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { allcardsAtom, loadingAtom } from '../store/atoms';

function CardsList() {
  const cards = useRecoilValue(allcardsAtom);
  const setLoading = useSetRecoilState(loadingAtom);

  const fetchCards = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/cards');
      setAllCards(response.data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {cards.map(card => <Card key={card.id} {...card} />)}
    </div>
  );
}
```

### State Persistence

- **Authentication**: Stored in HTTP-only cookies via backend
- **UI State**: Not persisted (resets on refresh)
- **Form Data**: Temporary state during form interactions

---

## 🧩 Components

### Layout Components

#### `DashboardLayout.tsx`
**Purpose**: Main layout wrapper for authenticated pages
**Props**: None
**Features**:
- Responsive sidebar navigation
- Outlet for nested routes
- Theme-aware styling

#### `Protected.tsx`
**Purpose**: Route protection component
**Props**: `{ children: ReactNode }`
**Logic**: Checks authentication state and redirects to login if needed

#### `Sidebar.tsx`
**Purpose**: Main navigation component
**Props**: None
**Features**:
- Navigation links to all pages
- User profile dropdown
- Logout functionality
- Responsive collapse/expand

### Feature Components

#### `Card.tsx`
**Purpose**: Display individual content cards
**Props**:
```typescript
interface CardProps {
  id: string;
  title: string;
  link: string;
  tags: string[];
  type: 'document' | 'video' | 'tweet' | 'link';
  createdAt: Date;
  isPublic: boolean;
}
```
**Features**:
- Edit and delete actions
- External link opening
- Tag display
- Type-specific icons
- Share status indicator

#### `AddCard.tsx`
**Purpose**: Modal for creating/editing cards
**Props**: `{ isOpen: boolean; onClose: () => void; editCard?: Card }`
**Features**:
- Form validation
- Tag input with autocomplete
- URL domain extraction
- Real-time preview

#### `ShareModal.tsx`
**Purpose**: Generate public share links
**Props**: `{ isOpen: boolean; onClose: () => void; selectedCards: string[] }`
**Features**:
- Multi-card selection
- Link generation
- Copy to clipboard
- QR code display (future)

#### `Loading.tsx`
**Purpose**: Global loading overlay
**Props**: `{ message?: string }`
**Features**:
- Full-screen overlay
- Custom loading messages
- Prevents user interaction

### UI Components

#### `CardSkeleton.tsx`
**Purpose**: Loading placeholder for cards
**Features**: Mimics card layout during loading

#### `ThemeToggle.tsx`
**Purpose**: Dark/light theme switcher
**Features**:
- System preference detection
- Local storage persistence
- Smooth transitions

---

## 📄 Pages & Routing

### Route Configuration

```typescript
// App.tsx routing setup
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<LandingPage />} />
      <Route path="auth" element={<AuthPages />} />
      <Route path=":shareId" element={<Share />} />
      <Route path="reset-password/:token" element={<ResetPassword />} />
      
      <Route path="home" element={<Protected><DashboardLayout /></Protected>}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="cards" element={<Cards />} />
        <Route path="search" element={<Search />} />
        <Route path="tags" element={<Tags />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Route>
  </Routes>
</BrowserRouter>
```

### Page Details

#### `LandingPage.tsx`
**Route**: `/`
**Purpose**: Public marketing page
**Features**:
- Hero section with call-to-action
- Feature highlights
- Login/signup links
- SEO optimized

#### `AuthPages.tsx`
**Route**: `/auth`
**Purpose**: User authentication
**Features**:
- Login/signup form toggle
- Email/password validation
- Google OAuth integration
- Password reset link

#### `Dashboard.tsx`
**Route**: `/home/dashboard`
**Purpose**: User home page with analytics
**Features**:
- Statistics cards (total cards, tags, searches)
- Recent activity
- Weekly charts
- Quick actions

#### `Cards.tsx`
**Route**: `/home/cards`
**Purpose**: Main cards management page
**Features**:
- All cards display with pagination
- Search and filter
- Add new card button
- Bulk actions (share, delete)
- Real-time updates via SSE

#### `Search.tsx`
**Route**: `/home/search`
**Purpose**: AI-powered semantic search
**Features**:
- Natural language query input
- Result limit slider
- Similarity scores
- Card preview in results

#### `Tags.tsx`
**Route**: `/home/tags`
**Purpose**: Tag-based filtering
**Features**:
- Multi-select tag filter
- Tag statistics
- Filtered card display

#### `Share.tsx`
**Route**: `/:shareId`
**Purpose**: Public shared content viewer
**Features**:
- Public access (no auth required)
- Card display without edit actions
- Social sharing buttons

---

## 🔌 API Integration

### Base Configuration

```typescript
// Environment-based API URL
const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Axios instance with defaults
const api = axios.create({
  baseURL: backendUrl,
  withCredentials: true, // For cookie-based auth
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Authentication Headers

```typescript
// Automatic JWT inclusion via cookies
// Backend sets HttpOnly cookie on login
// Frontend includes credentials automatically
```

### API Endpoints

#### Authentication (`/api/v1/auth/`)
| Method | Endpoint | Payload | Response | Usage |
|--------|----------|---------|----------|-------|
| POST | `/login` | `{email, password}` | `{user, token}` | User login |
| POST | `/signup` | `{email, password, username}` | `{user, token}` | User registration |
| POST | `/logout` | - | - | User logout |
| POST | `/forgetPassword` | `{email}` | - | Password reset request |
| POST | `/resetPassword/:token` | `{password}` | - | Password reset |
| GET | `/google` | - | Redirect | Google OAuth start |
| GET | `/google/callback` | - | `{user, token}` | Google OAuth callback |

#### Content Management (`/api/v1/content/`)
| Method | Endpoint | Payload | Response | Usage |
|--------|----------|---------|----------|-------|
| GET | `/cards` | - | `Card[]` | Fetch all user cards |
| POST | `/card` | `{title, link, tags, type}` | `Card` | Create new card |
| PUT | `/editCard/:id` | `{title, link, tags, type}` | `Card` | Update card |
| DELETE | `/card/:id` | - | - | Delete card |
| GET | `/metrics` | - | `Metrics` | Dashboard statistics |
| POST | `/query` | `{query, limit}` | `SearchResult[]` | AI semantic search |

#### User Management (`/api/v1/user/`)
| Method | Endpoint | Payload | Response | Usage |
|--------|----------|---------|----------|-------|
| GET | `/` | - | `User` | Get user profile |
| PUT | `/profile` | `{username, email, avatar}` | `User` | Update profile |
| POST | `/userconfirmation` | `{password}` | - | Verify password |

#### Sharing (`/api/v1/brain/`)
| Method | Endpoint | Payload | Response | Usage |
|--------|----------|---------|----------|-------|
| POST | `/share` | `{cardIds}` | `{shareId}` | Create share link |
| GET | `/:shareId` | - | `Card[]` | Get shared cards |

#### Verification (`/api/v1/me`)
| Method | Endpoint | Payload | Response | Usage |
|--------|----------|---------|----------|-------|
| GET | `/` | - | `User` | Verify authentication |

### Real-time Events (SSE)

```typescript
// Server-Sent Events for live updates
const eventSource = new EventSource(`${backendUrl}/events`, {
  withCredentials: true,
});

// Event listeners
eventSource.addEventListener('cardProcessed', (event) => {
  const data = JSON.parse(event.data);
  // Update UI with processing completion
});

eventSource.addEventListener('cardFailed', (event) => {
  const data = JSON.parse(event.data);
  // Show error notification
});
```

### Error Handling

```typescript
// Centralized error handler
export const handleError = (error: unknown, fallbackMessage?: string) => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message || fallbackMessage;
    toast.error(message);
  } else {
    toast.error(fallbackMessage || 'An unexpected error occurred');
  }
};
```

---

## 🎨 Styling & UI

### Tailwind CSS Configuration

The application uses Tailwind CSS v4 with custom configuration:

```javascript
// tailwind.config.js
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#64748b',
        // Custom theme colors
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

### Theme System

```typescript
// Theme context provider
const ThemeProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('system');
  
  // Detect system preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => setTheme(mediaQuery.matches ? 'dark' : 'light');
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

### Responsive Design

- **Mobile-first approach** with Tailwind's responsive prefixes
- **Breakpoint system**: `sm:`, `md:`, `lg:`, `xl:`
- **Flexible layouts** using CSS Grid and Flexbox
- **Touch-friendly** buttons and interactions

### Animation & Motion

```typescript
import { motion } from 'motion/react';

// Smooth card entrance
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  <Card {...card} />
</motion.div>
```

---

## 🚀 Deployment

### Vercel Deployment

1. **Connect Repository**: Link GitHub repo to Vercel
2. **Build Settings**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
3. **Environment Variables**:
   - `VITE_BACKEND_URL`: Your production backend URL
4. **Deploy**: Automatic on push to main branch

### Manual Build Process

```bash
# Build for production
npm run build

# Preview build locally
npm run preview

# Deploy dist/ folder to your hosting provider
```

### Build Optimization

- **Code Splitting**: Automatic route-based splitting
- **Asset Optimization**: Image compression and WebP conversion
- **CSS Minification**: Tailwind purging unused styles
- **JavaScript Minification**: Terser compression
- **Source Maps**: Generated for debugging

---

## 🔧 Troubleshooting

### Common Issues

#### Build Errors
**Problem**: `npm run build` fails with TypeScript errors
**Solution**:
```bash
# Check TypeScript errors
npx tsc --noEmit

# Fix import issues
npm run lint
```

#### API Connection Issues
**Problem**: Unable to connect to backend API
**Solutions**:
- Verify `VITE_BACKEND_URL` in `.env`
- Check backend server is running
- Confirm CORS configuration
- Check network/firewall settings

#### Authentication Problems
**Problem**: Login succeeds but requests fail
**Solutions**:
- Verify cookies are enabled
- Check backend JWT configuration
- Clear browser cookies and retry

#### Performance Issues
**Problem**: Slow loading or laggy UI
**Solutions**:
- Check network tab for large assets
- Verify build is optimized
- Check for memory leaks in React DevTools
- Enable React DevTools Profiler

### Development Tips

#### Hot Reload Not Working
```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Restart dev server
npm run dev
```

#### ESLint Errors
```bash
# Auto-fix linting issues
npm run lint -- --fix

# Format code
npm run format
```

#### Dependency Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 🤝 Contributing

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature`
3. **Make** your changes with proper TypeScript types
4. **Test** thoroughly: `npm run lint && npm run build`
5. **Commit** with descriptive messages
6. **Push** to your fork and create a Pull Request

### Code Standards

- **TypeScript**: Strict mode enabled, no `any` types
- **ESLint**: All rules must pass
- **Prettier**: Code formatted automatically
- **Commits**: Conventional commit format
- **Tests**: Unit tests for utilities and components

### Component Guidelines

- Use functional components with hooks
- Proper TypeScript interfaces for props
- Consistent naming: PascalCase for components
- Extract reusable logic to custom hooks
- Include JSDoc comments for complex functions

### State Management Guidelines

- Use Recoil atoms for global state
- Prefer local state for component-specific data
- Avoid prop drilling with context when possible
- Document atom purposes and types

---

## 📄 License

This project is part of the Second Brain application. See the main repository for licensing information.

---

*For backend documentation, see the [Server README](../server/README.md)*

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
