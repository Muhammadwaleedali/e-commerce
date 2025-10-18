import React, { useState, useEffect } from 'react';
import { categoryAPI } from '../api/endpoints';

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryAPI.getAll();
      setCategories(response.data);
    } catch (err) {
      setError('Failed to fetch categories');
      console.error('Fetch categories error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    try {
      const response = await categoryAPI.create({ name: newCategory });
      setCategories([...categories, response.data]);
      setNewCategory('');
    } catch (err) {
      setError('Failed to add category');
      console.error('Add category error:', err);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      await categoryAPI.delete(id);
      setCategories(categories.filter(cat => cat.id !== id));
    } catch (err) {
      setError('Failed to delete category');
      console.error('Delete category error:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Category Management</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <form onSubmit={handleAddCategory} className="mb-6 flex gap-4">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Enter category name"
          className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Category
        </button>
      </form>

      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div key={category.id} className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-lg font-semibold">{category.name}</h3>
              <button
                onClick={() => handleDeleteCategory(category.id)}
                className="mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryManager;