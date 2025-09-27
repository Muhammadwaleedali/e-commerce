import React, { useState, useEffect } from "react";
import axios from "../axios";
import ProductCard from "./ProductCard";

const CATEGORIES = [
  "Books",
  "Electronics",
  "Fashion",
  "Home & Garden",
  "Sports",
];

const CategoryProducts = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const url =
        selectedCategory === "All"
          ? "/api/product"
          : `/api/product?category=${encodeURIComponent(selectedCategory)}`;

      const response = await axios.get(url);
      setProducts(response.data);
    } catch (err) {
      setError("Failed to fetch products");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleProductDelete = (deletedProductId) => {
    // Update the products list by filtering out the deleted product
    setProducts(products.filter((product) => product._id !== deletedProductId));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Products</h2>
        {/* <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`px-4 py-2 rounded-full ${
              selectedCategory === "All"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            All
          </button>
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full ${
                selectedCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {category}
            </button>
          ))}
        </div> */}
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products?.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onDelete={handleProductDelete}
            />
          ))}
          {products.length === 0 && !loading && (
            <div className="col-span-full text-center text-gray-500 py-8">
              No products found in this category.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryProducts;
