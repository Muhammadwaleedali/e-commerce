# Technology Stack

## Core Technologies
- **React 18.2.0** - Frontend framework with modern hooks and concurrent features
- **Vite 5.1.0** - Build tool and development server for fast development
- **JavaScript (ES6+)** - Primary programming language with modern syntax

## State Management
- **Redux Toolkit 2.2.1** - Simplified Redux for predictable state management
- **React Redux 9.1.0** - React bindings for Redux integration
- **React Context API** - Authentication and user session management

## Routing & Navigation
- **React Router DOM 6.22.1** - Client-side routing with modern API

## HTTP & API
- **Axios 1.12.2** - Promise-based HTTP client with interceptors
- **API Base URL**: `https://localhost:7195` (configured in axios.js)

## Styling & UI
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **PostCSS 8.4.35** - CSS processing with Autoprefixer 10.4.17
- **React Icons 5.0.1** - Icon library for consistent iconography

## Development Tools
- **ESLint 8.56.0** - Code linting with React-specific rules
- **Vite Dev Server** - Hot module replacement on port 5173
- **Proxy Configuration** - API proxying to backend services

## Build Configuration
- **Module Type**: ES modules
- **Build Target**: Modern browsers with ES6+ support
- **Development Port**: 5173
- **Proxy Targets**: 
  - `/api` → `http://localhost:5000`
  - `/uploads` → `http://localhost:5000`

## Development Commands
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint checks
npm run preview  # Preview production build
```

## Authentication
- **JWT Tokens** - Stored in localStorage
- **Bearer Authentication** - Automatic token injection via Axios interceptors
- **Session Management** - Automatic logout on 401 responses