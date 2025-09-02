# WebSocket Lab 🚀

A modern real-time web application built with WebSocket technology, featuring user authentication, friend management, and live activity status updates.

## 📋 Overview

WebSocket Lab is a full-stack TypeScript application that demonstrates real-time communication between users. The application includes user registration/login, friend management system, and live activity status updates through WebSocket connections.

### Key Features

- 🔐 **User Authentication** - Registration, login with username/email and Google OAuth integration
- 👥 **Friend Management** - Add friends, manage friend requests, and track friend status
- 📡 **Real-time Communication** - WebSocket-based live activity status updates
- 🎨 **Modern UI** - React with Material-UI components and custom theming
- 💾 **Robust Database** - PostgreSQL/SQLite with Sequelize ORM and caching
- 🔒 **Secure** - SSL support, cookie-based authentication, and input validation

## 🏗️ Architecture

### Frontend (`/client`)

- **React 19** with TypeScript
- **Material-UI** for components and theming
- **React Router** for navigation
- **WebSocket** for real-time communication
- **Axios** for API requests
- **Context API** for state management

### Backend (`/server`)

- **Node.js** with TypeScript
- **WebSocket Server** for real-time communication
- **Sequelize ORM** with PostgreSQL/SQLite support
- **File-based caching** for performance
- **SSL support** for development
- **RESTful API** for user management

## 🚀 Getting Started

### Prerequisites

- **Node.js** ^22.15.1
- **Yarn** ^1.22.22
- **PostgreSQL**

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd web-socket-lab
   ```

2. **Install dependencies**

   ```bash
   yarn install
   ```

3. **Environment Setup**

   Create environment files:
   - `/client/.env.dev` - Client development environment
   - `/client/.env.prd` - Client production environment
   - `/server/.env.dev` - Server development environment
   - `/server/.env.prd` - Server production environment

   Required environment variables:

   ```bash
   # Server (.env.dev/.env.prd)
   PORT=3005
   APP_KEY=your-app-key
   WS_SERVER=localhost:3005
   LOCALHOST_SSL_KEY=/path/to/ssl/key
   LOCALHOST_SSL_CERT=/path/to/ssl/cert
   COOKIE_DOMAIN=localhost

   # Client (.env.dev/.env.prd)
   WS_SERVER=localhost:3005
   ACCOUNT_API=https://localhost:3005/api
   ```

4. **SSL Certificates (Development)**

   Generate SSL certificates for local development:

   ```bash
   # Example using mkcert
   mkcert localhost
   ```

### Development

**Start the development server:**

```bash
yarn dev
```

This command will:

- Start the backend server with hot reload
- Build and serve the frontend client
- Set up WebSocket server for real-time communication

**Individual commands:**

```bash
# Server only
yarn dev:server

# Client workspace commands
yarn ws:client <command>

# Server workspace commands
yarn ws:server <command>
```

### Production

**Build for production:**

```bash
yarn build
```

**Start production server:**

```bash
yarn start
```

## 🛠️ Development Workflow

### Project Structure

```
web-socket-lab/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── providers/      # Context providers
│   │   ├── hooks/          # Custom hooks
│   │   ├── interfaces/     # TypeScript interfaces
│   │   └── utils/          # Utility functions
│   └── public/             # Compiled frontend
│
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── database/       # Database models and types
│   │   ├── routes/         # API routes
│   │   ├── websocket/      # WebSocket event handlers
│   │   └── utils/          # Server utilities
│   └── public/             # User-uploaded files + static assets
└── README.md
```

### Coding Standards

- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting
- **Yarn Workspaces** for monorepo management

### Database

The application uses **Sequelize ORM** with the following models:

- **User** - User accounts with authentication
- **Friends** - Friend relationships and status
- **AccountType** - User account types
- **FriendStatus** - Friend request status types

## 🤝 How to Collaborate

### 1. **Fork & Clone**

```bash
git clone <your-fork-url>
cd web-socket-lab
```

### 2. **Create Feature Branch**

```bash
git checkout -b feature/your-feature-name
```

### 3. **Development Guidelines**

#### Code Style

- Follow existing TypeScript/React patterns
- Use meaningful variable and function names
- Add JSDoc comments for functions
- Keep components small and focused

#### Testing

- Test your changes locally before submitting
- Ensure WebSocket connections work properly
- Verify authentication flows
- Test both frontend and backend changes

#### Commit Messages

Use conventional commit format:

```
feat: add user profile editing
fix: resolve websocket connection issue
docs: update API documentation
refactor: improve user authentication flow
```

### 4. **Pull Request Process**

1. **Before submitting:**
   - Run linting: `yarn lint`
   - Test the application thoroughly
   - Update documentation if needed

2. **Pull Request checklist:**
   - [ ] Code follows project conventions
   - [ ] Changes are tested locally
   - [ ] Documentation is updated
   - [ ] No breaking changes (or clearly documented)
   - [ ] WebSocket functionality is preserved

3. **Submit PR with:**
   - Clear description of changes
   - Screenshots/videos if UI changes
   - Steps to test the changes
   - Any breaking changes noted

### 5. **Development Tips**

#### WebSocket Development

- Use browser dev tools WebSocket tab for debugging
- Test connection handling (open/close/error states)
- Verify real-time updates work correctly

#### Database Changes

- Use Sequelize migrations for schema changes
- Consider cache invalidation for model changes

#### Environment Setup

- Use `.env.dev` for development settings
- Never commit sensitive environment variables
- Document any new environment variables needed

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/login` - User login
- `POST /api/register` - User registration
- `GET /api/user/find` - Find user by token

### User Management

- `POST /api/user` - Find user by credentials
- `POST /api/user/update` - Update user profile

### WebSocket Events

- `updateActivityStatus` - Real-time activity updates
- Connection authentication via cookies
- Automatic friend notification system

## 📄 License

MIT License - feel free to use this project for learning and development.
