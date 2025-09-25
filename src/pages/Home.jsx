import React, { useEffect } from "react";
import { Categories } from "../assets/mockData";
import InfoSection from "../components/InfoSection";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/productSlice";
import ProductCard from "../components/ProductCard";
import heroImage from "../components/image/shop.png";
import Shop from "./Shop";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleCategoryClick = (categoryName) => {
    navigate(`/shop?category=${encodeURIComponent(categoryName)}`);
  };

  const handleProductDelete = (deletedProductId) => {
    dispatch(fetchProducts());
  };

  return (
    <div className="bg-white mt-2 px-4 md:px-16 lg:px-24">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-3/12">
          <div className="bg-red-600 text-white text-xs font-bold px-2 py-2.5">
            SHOP BY CATEGORIES
          </div>
          <div className="bg-gray-100 border">
            {Categories.map((category) => (
              <div
                key={category.id}
                className="category-container cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={() => handleCategoryClick(category.name)}
              >
                <div className="flex items-center justify-between p-3">
                  <div className="flex items-center text-sm font-medium">
                    <div className="w-2 h-2 border border-red-500 rounded-full mr-2"></div>
                    {category.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full md:w-9/12 h-96 relative">
          <img
            src={heroImage}
            alt="Hero"
            className="h-full w-full object-cover rounded-lg"
          />
          <div className="absolute top-1/4 left-8">
            <h2 className="text-3xl font-bold text-gray-800">
              Welcome TO E-SHOP
            </h2>
            <p className="text-xl mt-2.5 font-bold text-gray-800">
              Millions+ Product
            </p>
            <button
              onClick={() => navigate("/shop")}
              className="bg-red-600 px-8 py-1.5 text-white mt-4 hover:bg-red-700 transform transition-transform duration-300 hover:scale-105"
            >
              SHOP NOW
            </button>
          </div>
        </div>
      </div>
      <InfoSection />
      <div className="container mx-auto py-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Top Products</h2>
        {loading ? (
          <div className="text-center">Loading products...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {products.slice(0, 5).map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onDelete={handleProductDelete}
              />
            ))}
          </div>
        )}
      </div>
      <Shop />
    </div>
  );
};

export default Home;
