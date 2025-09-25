import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaCartShopping } from "react-icons/fa6";
import Modal from "./Modal";
import { FaSearch } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { fetchCart } from "../redux/cartSlice";
import Login from "./login";
import Register from "./Register";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
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

  const openLogin = () => {
    setIsLogin(true);
    setIsModelOpen(true);
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
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm">
                {user.isAdmin ? "Admin" : "Welcome"}, {user.email}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <button
                className="hidden md:block hover:text-blue-600"
                onClick={openLogin}
              >
                Login | Register
              </button>
              <button className="block md:hidden" onClick={openLogin}>
                <FaUser />
              </button>
            </>
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
          />
        ) : (
          <Register
            openLogin={openLogin}
            onClose={() => setIsModelOpen(false)}
          />
        )}
      </Modal>
    </nav>
  );
};

export default Navbar;
