import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AddProduct from "../components/AddProduct";
import FloatingAddProduct from "../components/FloatingAddProduct";
import TestProductsButton from "../components/TestProductsButton";

const AdminPanel = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user || !user.isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Admin Dashboard
            </h2>
            <div className="flex items-center space-x-4">
              <TestProductsButton />
              <div className="text-sm text-gray-600">
                Logged in as: {user.email}
              </div>
            </div>
          </div>

          <AddProduct />
        </div>
      </div>
      <FloatingAddProduct />
    </div>
  );
};

export default AdminPanel;
