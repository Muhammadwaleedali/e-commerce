import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaCartShopping } from "react-icons/fa6";
import Modal from "./Modal";
import { FaSearch } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { fetchCart } from "../redux/cartSlice";
import Login from "./login";
import Register from "./Register";
import AddProductModal from "./AddProductModal";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const [loginType, setLoginType] = useState('user');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  // Get search query from URL on component mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("search");
    if (query) {
      setSearchQuery(query);
    }
  }, [location.search]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowLoginDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/shop");
    }
  };

  const openSignUp = () => {
    setIsLogin(false);
    setIsModelOpen(true);
  };

  const openLogin = (type = 'user') => {
    setLoginType(type);
    setIsLogin(true);
    setIsModelOpen(true);
    setShowLoginDropdown(false);
  };

  const handleLogout = () => {
    logout();
  };

  const cart = useSelector((state) => state.cart);

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 md:px-16 lg:px-24 py-4 flex justify-between items-center">
        <div className="text-lg font-bold">
          <Link to="/">e-SHOP</Link>
        </div>
        <div className="relative flex-1 mx-4">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Product"
              className="w-full border py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-blue-500"
            >
              <FaSearch className="text-xl" />
            </button>
          </form>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/cart" className="relative">
            <FaCartShopping className="text-lg" />
            {cart.items && cart.items.length > 0 && (
              <span className="absolute top-0 text-xs w-3 left-3 bg-red-600 rounded-full flex justify-center text-white">
                {cart.totalQuantity}
              </span>
            )}
          </Link>
          {user && user.isAdmin && (
            <button
              onClick={() => setShowAddProduct(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300 font-medium"
            >
              Add Product
            </button>
          )}
          {user ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium">
                  {user.isAdmin ? "Admin" : "Welcome"}, {user.name || user.email}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300 font-medium"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300 font-medium"
                onClick={openSignUp}
              >
                Register
              </button>
              <div className="relative" ref={dropdownRef}>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 font-medium"
                  onClick={() => setShowLoginDropdown(!showLoginDropdown)}
                >
                  Login
                </button>
                {showLoginDropdown && (
                  <div className="absolute right-0 mt-3 w-40 bg-white border rounded-lg shadow-lg z-50">
                    <button
                      onClick={() => openLogin('user')}
                      className="block w-full text-left px-4 py-3 hover:bg-blue-50 text-gray-700 font-medium transition duration-200"
                    >
                      👤 User Login
                    </button>
                    <hr className="border-gray-200" />
                    <button
                      onClick={() => openLogin('admin')}
                      className="block w-full text-left px-4 py-3 hover:bg-blue-50 text-gray-700 font-medium transition duration-200"
                    >
                      🔐 Admin Login
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center justify-center space-x-10 py-4 text-sm font-bold">
        <Link to="/" className="hover:underline">
          Home
        </Link>
        <Link to="/shop" className="hover:underline">
          SHOP
        </Link>
        <Link to="/contact" className="hover:underline">
          Contact
        </Link>
        <Link to="/about" className="hover:underline">
          About
        </Link>
      </div>
      <Modal isModelOpen={isModelOpen} setIsModelOpen={setIsModelOpen}>
        {isLogin ? (
          <Login
            openSignUp={openSignUp}
            onClose={() => setIsModelOpen(false)}
            loginType={loginType}
          />
        ) : (
          <Register
            openLogin={() => openLogin('user')}
            onClose={() => setIsModelOpen(false)}
          />
        )}
      </Modal>
      <Modal isModelOpen={showAddProduct} setIsModelOpen={setShowAddProduct}>
        <AddProductModal onClose={() => setShowAddProduct(false)} />
      </Modal>
    </nav>
  );
};

export default Navbar;
