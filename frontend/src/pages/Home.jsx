import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaCheckCircle, FaShieldAlt, FaClock, FaStar } from 'react-icons/fa';
import { API_URL, getImageUrl } from '../config/api';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    fetchFeaturedProducts();
    fetchOffers();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`);
      const featured = response.data.filter((p) => p.featured).slice(0, 3);
      setFeaturedProducts(featured);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchOffers = async () => {
    try {
      const response = await axios.get(`${API_URL}/offers`);
      setOffers(response.data);
    } catch (error) {
      console.error('Error fetching offers:', error);
    }
  };

  const getOfferImageUrl = (imageName) => {
    if (!imageName) return null;
    return getImageUrl(imageName);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to American Pizza</h1>
          <p className="text-xl mb-8">Delicious, Fresh, and Made with Love</p>
          <Link
            to="/products"
            className="bg-yellow-400 text-green-700 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-yellow-300 transition inline-block"
          >
            Order Now
          </Link>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <FaShieldAlt className="text-4xl text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Safe & Secure</h3>
              <p className="text-gray-600">Your data and payments are protected</p>
            </div>
            <div className="flex flex-col items-center">
              <FaClock className="text-4xl text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Quick and reliable delivery service</p>
            </div>
            <div className="flex flex-col items-center">
              <FaCheckCircle className="text-4xl text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Quality Assured</h3>
              <p className="text-gray-600">Fresh ingredients, every time</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Pizzas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition"
              >
                <img
                  src={getImageUrl(product.image)}
                  alt={product.name}
                  className="w-full h-40 object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                  }}
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-green-600">${product.price}</span>
                    <Link
                      to={`/product/${product._id}`}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offers Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 via-green-700 to-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Special Offers</h2>
          {offers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {offers.map((offer) => (
                <div
                  key={offer._id}
                  className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-6 border border-white border-opacity-30 hover:bg-opacity-30 transition-all transform hover:scale-105"
                >
                  {offer.image && (
                    <div className="mb-4">
                      <img
                        src={getOfferImageUrl(offer.image)}
                        alt={offer.title}
                        className="w-full h-40 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <div className="bg-yellow-400 text-green-700 px-4 py-2 rounded-full inline-block mb-4 font-bold text-lg">
                    {offer.discount}% OFF
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">{offer.title}</h3>
                  <p className="text-lg mb-4">{offer.description}</p>
                  <div className="bg-white bg-opacity-30 rounded-lg p-3 mb-4">
                    <p className="text-sm mb-1">Use Code:</p>
                    <p className="text-2xl font-mono font-bold text-yellow-300">{offer.code}</p>
                  </div>
                  {offer.minOrderAmount > 0 && (
                    <p className="text-sm text-yellow-200">
                      Min. order: ${offer.minOrderAmount}
                    </p>
                  )}
                  <p className="text-sm mt-4 text-yellow-200">
                    Valid until: {new Date(offer.validUntil).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white bg-opacity-20 rounded-lg p-6">
                <p className="text-lg">No active offers at the moment. Check back soon!</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;

