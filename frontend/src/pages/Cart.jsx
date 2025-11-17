import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FaPlus, FaMinus, FaTrash, FaTruck, FaStore } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { API_URL, getImageUrl } from '../config/api';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getTotalAmount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [deliveryType, setDeliveryType] = useState('pickup');
  const [address, setAddress] = useState('');
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [distance, setDistance] = useState(0);
  const [calculating, setCalculating] = useState(false);


  useEffect(() => {
    if (deliveryType === 'pickup') {
      setDeliveryCharge(0);
      setDistance(0);
      setAddress('');
    }
  }, [deliveryType]);

  useEffect(() => {
    const calculateDelivery = async () => {
      if (deliveryType === 'delivery' && address.trim().length > 10) {
        setCalculating(true);
        try {
          const response = await axios.post(`${API_URL}/delivery/calculate`, {
            address: address,
          });
          setDistance(response.data.distance);
          setDeliveryCharge(response.data.deliveryCharge);
        } catch (error) {
          console.error('Error calculating delivery:', error);
          setDeliveryCharge(0);
        } finally {
          setCalculating(false);
        }
      } else if (deliveryType === 'delivery' && address.trim().length <= 10) {
        setDeliveryCharge(0);
        setDistance(0);
      }
    };

    const timeoutId = setTimeout(calculateDelivery, 1000); // Debounce
    return () => clearTimeout(timeoutId);
  }, [address, deliveryType, API_URL]);

  const handleProceedToPayment = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }
    if (deliveryType === 'delivery' && !address.trim()) {
      alert('Please enter a delivery address');
      return;
    }
    navigate('/payment', {
      state: {
        deliveryType,
        address,
        deliveryCharge,
        distance,
      },
    });
  };

  const subtotal = getTotalAmount();
  const total = subtotal + deliveryCharge;

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-8">Your Cart</h1>
        <p className="text-xl text-gray-600 mb-8">Your cart is empty</p>
        <Link
          to="/products"
          className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition inline-block"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-6">
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center space-x-4 mb-6 pb-6 border-b last:border-0">
                <img
                  src={getImageUrl(item.image)}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                  <p className="text-gray-600 mb-2">${item.price} each</p>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded transition"
                      >
                        <FaMinus />
                      </button>
                      <span className="text-lg font-semibold w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded transition"
                      >
                        <FaPlus />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-600 hover:text-red-700 transition ml-4"
                      title="Remove item"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-green-600">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

            {/* Delivery Type Selection */}
            <div className="mb-6">
              <label className="block text-lg font-semibold mb-3">Delivery Option</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDeliveryType('pickup')}
                  className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-semibold transition-all ${
                    deliveryType === 'pickup'
                      ? 'bg-green-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <FaStore />
                  <span>Pickup</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryType('delivery')}
                  className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-semibold transition-all ${
                    deliveryType === 'delivery'
                      ? 'bg-green-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <FaTruck />
                  <span>Delivery</span>
                </button>
              </div>
            </div>

            {/* Address Field for Delivery */}
            {deliveryType === 'delivery' && (
              <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                <label className="block text-lg font-semibold mb-2 text-gray-800">
                  <FaTruck className="inline mr-2 text-green-600" />
                  Delivery Address *
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your full delivery address (e.g., Street, City, Postal Code)"
                  rows="3"
                  required
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600 transition"
                />
                {calculating && (
                  <div className="mt-2 flex items-center text-sm text-blue-600">
                    <span className="animate-spin mr-2">⏳</span>
                    Calculating distance and delivery charge...
                  </div>
                )}
                {!calculating && distance > 0 && (
                  <div className="mt-3 p-3 bg-white rounded-lg border border-green-200 space-y-1">
                    <p className="text-green-700 font-semibold text-base">
                      📍 Distance: {distance.toFixed(2)} km
                    </p>
                    <p className="text-gray-700 font-medium">
                      {distance <= 10 
                        ? '💰 Delivery charge: €2.00 (≤ 10 km)'
                        : '💰 Delivery charge: €3.00 (> 10 km)'
                      }
                    </p>
                  </div>
                )}
                {!calculating && address.trim().length > 0 && distance === 0 && (
                  <p className="text-sm text-orange-600 mt-2">
                    ⚠️ Please enter a complete address to calculate delivery charge
                  </p>
                )}
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
                  <div className="flex justify-between">
                <span>Delivery</span>
                {deliveryType === 'pickup' ? (
                  <span className="text-green-600 font-semibold">Free</span>
                ) : (
                  <span>
                    {calculating ? (
                      <span className="text-gray-500">Calculating...</span>
                    ) : deliveryCharge > 0 ? (
                      <span className="text-red-600 font-semibold">€{deliveryCharge.toFixed(2)}</span>
                    ) : (
                      <span className="text-gray-500">Enter address</span>
                    )}
                  </span>
                )}
              </div>
              <div className="border-t pt-4 flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="text-green-600">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
            <button
              onClick={handleProceedToPayment}
              disabled={deliveryType === 'delivery' && !address.trim()}
              className="w-full bg-green-600 text-white py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Proceed to Payment
            </button>
            <Link
              to="/products"
              className="block text-center mt-4 text-gray-600 hover:text-gray-800 transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

