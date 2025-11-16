import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imageName) => {
    if (!imageName) {
      return 'https://via.placeholder.com/400x300?text=No+Image';
    }
    // Get base URL (remove /api if present)
    let baseUrl = API_URL;
    if (baseUrl.includes('/api')) {
      baseUrl = baseUrl.replace('/api', '');
    }
    if (!baseUrl) {
      baseUrl = 'http://localhost:5000';
    }
    return `${baseUrl}/uploads/${imageName}`;
  };

  // Group products by category
  const productsByCategory = products.reduce((acc, product) => {
    const category = product.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {});

  const categories = Object.keys(productsByCategory).sort();

  // Filter to show only selected category or all
  const displayCategories = selectedCategory 
    ? [selectedCategory] 
    : categories;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Our Menu</h1>

      {/* Category Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            selectedCategory === null
              ? 'bg-red-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All Categories
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              selectedCategory === cat
                ? 'bg-red-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products by Category */}
      {displayCategories.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-gray-600">No products available.</p>
        </div>
      ) : (
        displayCategories.map((category) => (
          <div key={category} className="mb-16">
            <h2 className="text-3xl font-bold mb-6 pb-3 border-b-2 border-red-600">
              {category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {productsByCategory[category].map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition cursor-pointer"
                >
                  <Link to={`/product/${product._id}`}>
                    <img
                      src={getImageUrl(product.image)}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                      }}
                    />
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-red-600">${product.price}</span>
                        <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm">
                          {product.category}
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Products;

