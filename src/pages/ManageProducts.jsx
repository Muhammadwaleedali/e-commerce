import React, { useState, useEffect } from "react";
import AddProduct from "../components/AddProduct";
import { productAPI } from "../api/endpoints";
import { FaEdit, FaTrash } from "react-icons/fa";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      const response = await productAPI.getAll();
      setProducts(response.data);
    } catch (err) {
      setError("Failed to fetch products");
      console.error("Fetch products error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleProductAdded = (newProduct) => {
    setProducts((prev) => [...prev, newProduct]);
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await productAPI.delete(productId);
      setProducts((prev) => prev.filter((p) => p._id !== productId));
      alert("Product deleted successfully!");
    } catch (err) {
      alert("Failed to delete product");
      console.error("Delete product error:", err);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Manage Products</h1>

      {/* Add Product Form */}
      <div className="mb-12">
        <AddProduct onProductAdded={handleProductAdded} />
      </div>

      {/* Products List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product._id} className="bg-white rounded-lg shadow p-4">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-full h-48 object-contain mb-4"
            />
            <h3 className="text-lg font-semibold">{product.title}</h3>
            <p className="text-gray-600">${product.price}</p>
            {product.description && (
              <p className="text-sm text-gray-500 mt-2">
                {product.description}
              </p>
            )}
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => handleDeleteProduct(product._id)}
                className="p-2 text-red-600 hover:text-red-800"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageProducts;
