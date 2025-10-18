# Development Guidelines

## Code Quality Standards

### File Naming Conventions
- **Components**: PascalCase (e.g., `Checkout.jsx`, `AuthContext.jsx`)
- **Services/Utils**: camelCase (e.g., `checkoutService.js`, `endpoints.js`)
- **Redux Files**: camelCase with descriptive suffix (e.g., `cartSlice.jsx`, `store.jsx`)

### Import Organization
```javascript
// External libraries first
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

// Internal imports second
import { checkoutService } from "../services/checkoutService";
import { clearCart } from "../redux/cartSlice";
```

### Component Structure Pattern
```javascript
const ComponentName = () => {
  // 1. Hooks (useState, useEffect, etc.)
  const [state, setState] = useState(initialValue);
  
  // 2. Redux hooks
  const data = useSelector((state) => state.slice);
  const dispatch = useDispatch();
  
  // 3. Router hooks
  const navigate = useNavigate();
  
  // 4. Event handlers
  const handleAction = () => {
    // Implementation
  };
  
  // 5. JSX return
  return (
    <div className="container mx-auto py-8">
      {/* Component content */}
    </div>
  );
};

export default ComponentName;
```

## State Management Patterns

### Redux Toolkit Usage
- **Async Thunks**: Use `createAsyncThunk` for API calls with proper error handling
- **Slice Structure**: Include `pending`, `fulfilled`, and `rejected` cases in `extraReducers`
- **Error Handling**: Use `rejectWithValue` for consistent error responses

```javascript
export const fetchData = createAsyncThunk(
  "slice/fetchData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/endpoint");
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Default error message"
      );
    }
  }
);
```

### Context API Pattern
- **Provider Setup**: Initialize state from localStorage with error handling
- **Custom Hooks**: Export custom hook for context consumption
- **Token Management**: Automatically set/remove axios headers based on auth state

## API Integration Standards

### Endpoint Organization
- **Grouped APIs**: Organize by resource (productAPI, categoryAPI, orderAPI, authAPI, cartAPI)
- **Consistent Methods**: Use standard CRUD operations (getAll, getById, create, update, delete)
- **Logging**: Include comprehensive API call logging with method, URL, and payload

```javascript
export const resourceAPI = {
  getAll: async () => {
    logApiCall('GET', '/api/Resource');
    return await axios.get('/api/Resource');
  },
  
  create: async (data) => {
    logApiCall('POST', '/api/Resource', data);
    return await axios.post('/api/Resource', data);
  }
};
```

### HTTP Client Configuration
- **Interceptors**: Use request interceptors for authentication and response interceptors for error handling
- **Token Management**: Automatic Bearer token injection from localStorage
- **Content-Type Handling**: Special handling for FormData vs JSON payloads
- **Error Logging**: Comprehensive error logging with status, data, and URL information

## UI/UX Patterns

### Tailwind CSS Standards
- **Container Pattern**: `container mx-auto py-8 px-4 md:px-16 lg:px-24`
- **Responsive Design**: Use responsive prefixes (md:, lg:) for different screen sizes
- **Color Scheme**: Consistent color palette (red-600, blue-600, green-600, gray-800)
- **Spacing**: Consistent spacing using Tailwind's spacing scale

### Form Handling
- **Controlled Components**: All form inputs use controlled state with `value` and `onChange`
- **Validation**: Client-side validation with error state management
- **Input Styling**: Consistent input classes: `w-full px-3 py-2 border rounded-md`

### Button Patterns
```javascript
// Primary action button
className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200"

// Secondary action button  
className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition duration-200"
```

## Error Handling Standards

### Try-Catch Pattern
```javascript
try {
  const result = await apiCall();
  // Success handling
} catch (err) {
  setError("User-friendly error message");
  console.error("Detailed error for debugging:", err);
}
```

### Error Display
- **User Feedback**: Show user-friendly error messages in UI
- **Console Logging**: Detailed error logging for debugging
- **Error States**: Manage error state in components and Redux slices

## Routing Patterns

### Route Protection
- **ProtectedRoute**: Wrap authenticated routes
- **AdminRoute**: Separate guard for admin-only routes
- **Layout Control**: Conditional navbar/footer rendering based on route

### Navigation Structure
```javascript
<Route path="/protected" element={<ProtectedRoute><Component /></ProtectedRoute>} />
<Route path="/admin" element={<AdminRoute />}>
  <Route index element={<AdminPanel />} />
</Route>
```

## Performance Optimization

### Component Optimization
- **Conditional Rendering**: Use logical operators for conditional UI elements
- **State Batching**: Group related state updates together
- **Memoization**: Consider React.memo for expensive components

### Data Management
- **Local Storage**: Use for persistent data (tokens, user data, orders)
- **State Normalization**: Keep Redux state flat and normalized
- **Loading States**: Implement loading indicators for async operations