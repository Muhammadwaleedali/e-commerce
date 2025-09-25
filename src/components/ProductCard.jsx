import React, { useState } from "react";
import { FaStar, FaTrash, FaShoppingCart } from "react-icons/fa";
import { addToCartAsync, removeFromCartAsync } from "../redux/cartSlice";
import { useDispatch } from "react-redux";
import { useAuth } from "../context/AuthContext";
import axios from "../axios";

const ProductCard = ({ product, isInCart, onDelete }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.isAdmin;

  // Handle different image path formats
  const productImage = product.imageUrl || product.image || "";

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    const formattedProduct = {
      _id: product._id || product.id,
      name: product.name || product.title,
      price: product.price,
      image: productImage,
    };

    setLoading(true);
    try {
      const resultAction = await dispatch(addToCartAsync(formattedProduct));
      if (addToCartAsync.fulfilled.match(resultAction)) {
        alert("Product added successfully!");
      } else if (addToCartAsync.rejected.match(resultAction)) {
        const errorMessage =
          resultAction.payload || "Failed to add product to cart";
        alert(errorMessage);
      }
    } catch (err) {
      console.error("Add to cart error:", err);
      alert("Error adding product to cart");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromCart = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    setLoading(true);
    try {
      const resultAction = await dispatch(
        removeFromCartAsync(product._id || product.id)
      );
      if (removeFromCartAsync.fulfilled.match(resultAction)) {
        alert("Product removed successfully!");
      } else if (removeFromCartAsync.rejected.match(resultAction)) {
        const errorMessage =
          resultAction.payload || "Failed to remove product from cart";
        alert(errorMessage);
      }
    } catch (err) {
      console.error("Remove from cart error:", err);
      alert("Error removing product from cart");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (!isAdmin) {
      alert("Only administrators can delete products");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    const productId = product._id || product.id;
    if (!productId) {
      alert("Invalid product ID");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.delete(`/api/products/${productId}`);
      console.log("Delete response:", response.data);
      alert("Product deleted successfully!");
      if (onDelete) {
        onDelete(productId);
      }
    } catch (err) {
      console.error("Error deleting product:", err);
      if (err.response?.status === 404) {
        alert("Product not found. It may have been already deleted.");
      } else if (err.response?.status === 401) {
        alert("You must be logged in as an administrator to delete products.");
      } else {
        alert("Failed to delete product. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 shadow rounded relative border transform transition-transform duration-300 hover:scale-105">
      {isAdmin && (
        <button
          onClick={handleDeleteProduct}
          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 z-10 transform transition-transform hover:scale-110"
          title="Delete Product"
          disabled={loading}
        >
          <FaTrash size={16} />
        </button>
      )}
      <div className="mb-4">
        <img
          src={productImage}
          alt={product.name || product.title}
          className="w-full h-48 object-contain"
        />
      </div>
      <h3 className="text-lg font-semibold">{product.name || product.title}</h3>
      <p className="text-gray-500">${product.price}</p>
      {product.category && (
        <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded mt-2">
          {product.category}
        </span>
      )}
      <div className="flex items-center mt-2 mb-4">
        {[...Array(4)].map((_, index) => (
          <FaStar key={index} className="text-yellow-500 mr-1" />
        ))}
      </div>
      {isInCart ? (
        <button
          className="absolute bottom-4 right-2 flex items-center justify-center w-24 h-8 bg-red-600 group text-white text-sm rounded-full hover:bg-red-700"
          onClick={handleRemoveFromCart}
          disabled={loading}
        >
          {loading ? (
            <span className="animate-pulse">Removing...</span>
          ) : (
            <>
              <FaTrash className="mr-1" />
              <span>Remove</span>
            </>
          )}
        </button>
      ) : (
        <button
          className="absolute bottom-4 right-2 flex items-center justify-center w-24 h-8 bg-blue-600 group text-white text-sm rounded-full hover:bg-blue-700"
          onClick={handleAddToCart}
          disabled={loading}
        >
          {loading ? (
            <span className="animate-pulse">Adding...</span>
          ) : (
            <>
              <FaShoppingCart className="mr-1" />
              <span>Add</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default ProductCard;
