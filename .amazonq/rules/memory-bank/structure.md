# Project Structure

## Directory Organization

### `/src` - Main Application Code
- **`/api`** - API endpoint definitions and HTTP service configurations
- **`/assets`** - Static assets including images and mock data
- **`/components`** - Reusable React components organized by functionality
  - `/guards` - Route protection components (AdminRoute, ProtectedRoute)
  - `/image` - Static image assets for components
- **`/context`** - React Context providers for global state (AuthContext)
- **`/pages`** - Top-level page components and route handlers
- **`/redux`** - Redux Toolkit store configuration and slices
- **`/services`** - Business logic and external service integrations
- **`/utils`** - Utility functions and helper modules

### Core Application Files
- **`App.jsx`** - Main application component with routing configuration
- **`main.jsx`** - Application entry point and React DOM rendering
- **`axios.js`** - HTTP client configuration with interceptors
- **`index.css`** - Global styles and Tailwind CSS imports

## Architectural Patterns

### Component Architecture
- **Page Components**: Top-level route components in `/pages`
- **Feature Components**: Specialized components in `/components`
- **Guard Components**: Authentication and authorization wrappers

### State Management
- **Redux Store**: Centralized state management with Redux Toolkit
- **Context API**: Authentication state and user session management
- **Local State**: Component-specific state using React hooks

### API Layer
- **Axios Instance**: Configured HTTP client with base URL and interceptors
- **Endpoint Definitions**: Centralized API endpoint management
- **Service Layer**: Business logic abstraction over API calls

### Routing Structure
- **React Router**: Client-side routing with protected routes
- **Route Guards**: Authentication-based route protection
- **Nested Routing**: Hierarchical page organization