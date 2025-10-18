import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import AdminRoute from "./components/guards/AdminRoute";
import ProtectedRoute from "./components/guards/ProtectedRoute";
import AdminPanel from "./pages/AdminPanel";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Contact from "./components/Contact";
import About from "./components/About";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Carts from "./pages/Carts";
import Checkout from "./pages/Checkout";
import FloatingSignupModal from "./components/FloatingSignupModal";
import { useAuth } from "./context/AuthContext";

// Wrapper component to handle layout
function AppLayout() {
  const location = useLocation();
  const { user } = useAuth();

  // Check if current route is admin login or admin panel
  const hideNavAndFooter = ["/login", "/admin"].includes(location.pathname);
  
  // Show floating modal only on home page and when user is not logged in
  const showFloatingModal = location.pathname === "/" && !user;

  return (
    <>
      {!hideNavAndFooter && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/cart" element={<ProtectedRoute><Carts /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminRoute />}>
          <Route index element={<AdminPanel />} />
        </Route>
      </Routes>
      {!hideNavAndFooter && <Footer />}
      {showFloatingModal && <FloatingSignupModal />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
