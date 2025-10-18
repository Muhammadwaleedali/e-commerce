import React, { useState } from "react";
import { productAPI } from "../api/endpoints";

const CATEGORIES = [
  "Books",
  "Electronics",
  "Fashion",
  "Home & Garden",
  "Sports",
];

const AddProduct = ({ onProductAdded }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [productData, setProductData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [imageBase64, setImageBase64] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      try {
        const base64 = await convertToBase64(file);
        setImageBase64(base64);
      } catch (error) {
        setError('Failed to process image');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validate inputs
      if (
        !productData.name ||
        !productData.price ||
        !image ||
        !productData.category
      ) {
        throw new Error(
          "Please fill in all required fields (name, price, category, and image)"
        );
      }

      // Get category ID based on category name
      const categoryMap = {
        "Books": 1,
        "Electronics": 2,
        "Fashion": 3,
        "Home & Garden": 4,
        "Sports": 5
      };
      
      // Create product payload matching server requirements
      const productPayload = {
        id: 0,
        name: productData.name,
        price: parseFloat(productData.price),
        description: productData.description || "",
        stock: 100,
        categoryId: categoryMap[productData.category] || 1,
        categoryName: productData.category,
        image: image ? image.name : "",
        imageUrl: imageBase64
      };

      // Send request to backend
      const response = await productAPI.create(productPayload);

      alert("Product added successfully!");
      // Reset form
      setProductData({
        name: "",
        price: "",
        description: "",
        category: "",
      });
      setImage(null);
      setPreview(null);
      setImageBase64("");

      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";

      // Notify parent component
      if (onProductAdded) {
        onProductAdded(response.data);
      }
    } catch (err) {
      setError(err.message || "Failed to add product");
      console.error("Add product error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Name *
          </label>
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            name="category"
            value={productData.category}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price ($) *
          </label>
          <input
            type="number"
            name="price"
            value={productData.price}
            onChange={handleInputChange}
            step="0.01"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={productData.description}
            onChange={handleInputChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Image *
          </label>
          <div className="mt-1 flex flex-col items-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
              required
            />
            {preview && (
              <div className="mt-4 relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-48 object-contain"
                />
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-300"
        >
          {loading ? "Adding Product..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
