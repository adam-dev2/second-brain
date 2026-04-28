# Second Brain

<div align="center">
  <h3>🧠 Your Personal Knowledge Management System</h3>
  <p><em>Save, organize, and discover your digital knowledge with AI-powered search</em></p>

  ![Second Brain](https://img.shields.io/badge/Second-Brain-blue?style=for-the-badge)
  ![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript)
  ![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js)
  ![MongoDB](https://img.shields.io/badge/MongoDB-8.19-47A248?style=flat-square&logo=mongodb)
  ![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)
</div>

---

## 🎯 The Problem

In today's information-saturated world, we constantly encounter valuable content across the internet—articles, videos, tweets, documentation, and resources that could be useful later. However, most people struggle with:

- **Bookmark Chaos**: Browser bookmarks become unmanageable and hard to search
- **Lost Knowledge**: Important information gets buried in endless tabs or forgotten emails
- **Poor Discovery**: No way to find connections between related content
- **Manual Organization**: Time-consuming to categorize and tag content manually
- **No Sharing**: Difficult to share curated collections with others
- **Platform Lock-in**: Tied to specific browsers or tools with limited features

**The result?** We save less, forget more, and fail to leverage our accumulated knowledge effectively.

---

## 🚀 The Solution

**Second Brain** is a modern, AI-powered knowledge management system that transforms how you save, organize, and retrieve digital content. It acts as your external memory, helping you build a personal knowledge base that's searchable, shareable, and intelligently organized.

### ✨ Key Features

#### 🏷️ Smart Organization
- **Content Cards**: Save any web content (articles, videos, tweets, links) as organized cards
- **Flexible Tagging**: Tag content with custom labels for easy categorization
- **Content Types**: Automatically detect and categorize different content types
- **Visual Dashboard**: Overview of your knowledge base with statistics and trends

#### 🔍 AI-Powered Search
- **Semantic Search**: Find content using natural language queries, not just keywords
- **Vector Embeddings**: AI understands context and meaning, not just text matching
- **Intelligent Results**: Ranked by relevance with similarity scores
- **Fast Discovery**: Instant results across your entire knowledge base

#### 🌐 Sharing & Collaboration
- **Public Brains**: Share curated collections with anyone via unique links
- **No Sign-up Required**: Public shares work without accounts
- **Custom Collections**: Create themed collections for different purposes
- **Social Features**: Share your knowledge discoveries with others

#### ⚡ Real-time Experience
- **Live Processing**: See content being processed in real-time with progress updates
- **Instant Feedback**: Toast notifications and status updates
- **Background Sync**: Content processing happens asynchronously
- **Responsive Design**: Works seamlessly on desktop and mobile

#### 🔐 Secure & Private
- **User Authentication**: Secure login with email/password or OAuth (Google, GitHub)
- **Data Ownership**: Your content belongs to you
- **Privacy Controls**: Choose what to share publicly
- **Secure Storage**: Encrypted data storage and transmission

---

## 🏗️ Architecture Overview

Second Brain is built as a modern full-stack web application with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                    🌐 Second Brain                           │
│                  Personal Knowledge Hub                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐    ┌─────────────────┐                 │
│  │   Frontend      │    │   Backend       │                 │
│  │   (React)       │◄──►│   (Express)     │                 │
│  │                 │    │                 │                 │
│  │  • Dashboard    │    │  • REST API     │                 │
│  │  • Search UI    │    │  • Auth System  │                 │
│  │  • Card Mgmt    │    │  • Content Proc │                 │
│  │  • Real-time UI │    │  • SSE Events   │                 │
│  └─────────────────┘    └─────────────────┘                 │
│           │                       │                        │
├───────────▼───────────────────────▼────────────────────────┤
│  ┌─────────────────┐    ┌─────────────────┐                 │
│  │   Databases     │    │   AI Services   │                 │
│  │                 │    │                 │                 │
│  │  • MongoDB      │    │  • HuggingFace  │                 │
│  │  • Qdrant       │    │  • Jina AI      │                 │
│  │    (Documents)  │    │    (Embeddings) │                 │
│  │    (Metadata)   │    │    (Scraping)   │                 │
│  └─────────────────┘    └─────────────────┘                 │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Frontend** | React 18 + TypeScript | User interface and interactions |
| **Backend** | Express.js + TypeScript | API server and business logic |
| **Database** | MongoDB | Document storage and user data |
| **Vector DB** | Qdrant | Semantic search and embeddings |
| **AI** | HuggingFace API | Text embeddings for search |
| **Scraping** | Jina AI | Web content extraction |
| **Auth** | JWT + OAuth | User authentication |
| **Real-time** | Server-Sent Events | Live updates |

### Data Flow

1. **Content Ingestion**: User saves a URL → Frontend sends to Backend
2. **Processing Pipeline**: Backend scrapes content → Generates embeddings → Stores in databases
3. **Search Queries**: User searches → Backend finds similar vectors → Returns relevant content
4. **Real-time Updates**: Processing status sent via SSE → Frontend updates UI

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **MongoDB** (local or cloud instance)
- **Qdrant** (vector database, local or cloud)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd second-brain
   ```

2. **Install dependencies**
   ```bash
   # Install client dependencies
   cd client
   npm install

   # Install server dependencies
   cd ../server
   npm install
   ```

3. **Set up environment variables**

   **Client (.env in client/)**
   ```env
   VITE_BACKEND_URL=http://localhost:5000
   ```

   **Server (.env in server/)**
   ```env
   # Server
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173

   # Database
   MONGO_URI=mongodb://localhost:27017/secondbrain

   # AI Services
   HUGGINGFACE_API_KEY=your_huggingface_key
   JINA_API_KEY=your_jina_key

   # Authentication
   JWT_SECRET=your_super_secret_key

   # Vector Database
   QDRANT_URL=http://localhost:6333
   QDRANT_API_KEY=your_qdrant_key

   # OAuth (optional)
   GOOGLE_CLIENT_ID=your_google_client_id
   GITHUB_CLIENT_ID=your_github_client_id
   ```

4. **Start the databases**
   ```bash
   # MongoDB (if local)
   mongod

   # Qdrant (if local)
   docker run -p 6333:6333 qdrant/qdrant
   ```

5. **Start the application**
   ```bash
   # Terminal 1: Start backend
   cd server
   npm run dev

   # Terminal 2: Start frontend
   cd client
   npm run dev
   ```

6. **Open your browser**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

---

## 📖 Documentation

For detailed documentation, see the README files in each component:

- **[Client Documentation](./client/README.md)** - Frontend setup, components, and usage
- **[Server Documentation](./server/README.md)** - Backend API, database setup, and deployment

### Key Topics Covered

#### For Developers
- **Architecture Deep Dive**: Component relationships and data flow
- **API Reference**: Complete endpoint documentation
- **Database Schemas**: Data models and relationships
- **Authentication Flow**: JWT and OAuth implementation
- **Testing Guide**: Unit and integration testing
- **Deployment**: Production setup and configuration

#### For Users
- **User Guide**: How to save, organize, and search content
- **Features Overview**: Detailed feature explanations
- **Best Practices**: Tips for effective knowledge management
- **Troubleshooting**: Common issues and solutions

---

## 🎨 Screenshots & Demo

*Coming soon: Screenshots and demo video showcasing the application features*

---

## 🤝 Contributing

We welcome contributions! Second Brain is an open-source project that benefits from community involvement.

### Ways to Contribute

- **🐛 Bug Reports**: Found a bug? [Open an issue](https://github.com/adam-dev2/second-brain/issues)
- **✨ Feature Requests**: Have an idea? [Suggest it](https://github.com/adam-dev2/second-brain/issues)
- **💻 Code Contributions**: Fix bugs or add features
- **📖 Documentation**: Improve docs or add examples
- **🧪 Testing**: Add tests or improve test coverage

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Run tests: `npm test` (in both client and server)
5. Submit a pull request

See our [Contributing Guide](./CONTRIBUTING.md) for detailed guidelines.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

- **React & TypeScript** communities for amazing developer tools
- **HuggingFace** for accessible AI models
- **Qdrant** for powerful vector search capabilities
- **Jina AI** for web scraping services
- **Open source contributors** who make projects like this possible

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)
- **Documentation**: See component READMEs for detailed guides

---

<div align="center">
  <p><strong>Built with ❤️ for knowledge workers everywhere</strong></p>
  <p>Transform how you save, organize, and discover digital knowledge</p>
</div>

