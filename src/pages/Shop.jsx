import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "../axios";
import ProductCard from "../components/ProductCard";
import { useSelector } from "react-redux";
import CategoryProducts from "../components/CategoryProducts";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const cartItems = useSelector((state) => state.cart.items);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const searchParams = new URLSearchParams(location.search);
        const searchQuery = searchParams.get("search");
        const categoryQuery = searchParams.get("category");

        if (searchQuery) {
          const response = await axios.get(
            `/api/products?search=${encodeURIComponent(searchQuery)}`
          );
          setProducts(response.data);
        } else if (categoryQuery) {
          const response = await axios.get(
            `/api/products?category=${encodeURIComponent(categoryQuery)}`
          );
          setProducts(response.data);
        } else {
          setProducts([]); // Clear products when no search query
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [location.search]);

  const handleProductDelete = (deletedProductId) => {
    // Update the products list by filtering out the deleted product
    setProducts(products.filter((product) => product._id !== deletedProductId));
  };

  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search");
  const categoryQuery = searchParams.get("category");

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error)
    return <div className="text-center py-8 text-red-600">Error: {error}</div>;

  return (
    <div className="container mx-auto py-12 px-4 md:px-16 lg:px-24">
      {searchQuery ? (
        <>
          <h2 className="text-2xl font-bold mb-6 text-center">
            Search Results for "{searchQuery}"
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  isInCart={cartItems.some((item) => item._id === product._id)}
                  onDelete={handleProductDelete}
                />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500">
                No products found
              </div>
            )}
          </div>
        </>
      ) : categoryQuery ? (
        <>
          <h2 className="text-2xl font-bold mb-6 text-center">
            {categoryQuery} Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  isInCart={cartItems.some((item) => item._id === product._id)}
                  onDelete={handleProductDelete}
                />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500">
                No products found in this category
              </div>
            )}
          </div>
        </>
      ) : (
        <CategoryProducts />
      )}
    </div>
  );
};

export default Shop;
