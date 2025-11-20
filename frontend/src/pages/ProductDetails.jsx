import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { API_URL, getImageUrl } from '../config/api';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${API_URL}/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-2xl">Product not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image */}
        <div>
          <img
            src={getImageUrl(product.image)}
            alt={product.name}
            className="w-full max-h-96 object-cover rounded-lg shadow-lg"
            onError={(e) => {
              console.error('❌ Image failed to load for product:', product.name, 'Image URL was:', product.image);
              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="18" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImage Not Found%3C/text%3E%3C/svg%3E';
            }}
          />
        </div>

        {/* Details */}
        <div>
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          <span className="bg-red-100 text-red-600 px-4 py-2 rounded-full text-lg font-semibold mb-4 inline-block">
            {product.category}
          </span>
          <p className="text-gray-700 text-lg mb-6 leading-relaxed">
            {product.description}
          </p>
          <div className="mb-8">
            <span className="text-4xl font-bold text-red-600">${product.price}</span>
          </div>

          {/* Quantity Selector */}
          <div className="mb-8">
            <label className="block text-lg font-semibold mb-4">Quantity</label>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg transition"
              >
                <FaMinus />
              </button>
              <span className="text-2xl font-semibold w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg transition"
              >
                <FaPlus />
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-red-600 text-white py-4 rounded-lg text-lg font-semibold hover:bg-red-700 transition mb-4"
          >
            Add to Cart - ${(product.price * quantity).toFixed(2)}
          </button>

          {/* Trust Indicators */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 font-semibold mb-2">✓ Safe & Secure Checkout</p>
            <p className="text-green-700 text-sm">Your payment information is protected</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

