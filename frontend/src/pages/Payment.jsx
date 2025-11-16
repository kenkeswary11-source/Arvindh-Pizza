import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Payment = () => {
  const { cartItems, getTotalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get delivery info from navigation state
  const deliveryInfo = location.state || {
    deliveryType: 'pickup',
    address: '',
    deliveryCharge: 0,
    distance: 0,
  };

  const [formData, setFormData] = useState({
    customerName: user?.name || '',
    customerEmail: user?.email || '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    otp: '',
  });
  const [showOTP, setShowOTP] = useState(false);
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const subtotal = getTotalAmount();
  const deliveryCharge = deliveryInfo.deliveryCharge || 0;
  const total = subtotal + deliveryCharge;

  // Redirect to cart if no items
  React.useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!showOTP) {
      // Simulate OTP generation
      setShowOTP(true);
      return;
    }

    // Simulate OTP verification (in real app, verify with backend)
    if (formData.otp !== '1234') {
      alert('Invalid OTP. Use 1234 for demo.');
      return;
    }

    setLoading(true);

    try {
      // Prepare order items
      const items = cartItems.map((item) => ({
        product: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      }));

      // Create order
      const response = await axios.post(
        `${API_URL}/orders`,
        {
          items,
          totalAmount: subtotal, // Subtotal without delivery charge (backend will add it)
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          paymentMethod: 'card',
          deliveryType: deliveryInfo.deliveryType || 'pickup',
          address: deliveryInfo.address || '',
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      clearCart();
      navigate('/payment-success', { state: { orderId: response.data._id } });
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-4xl font-bold mb-8">Payment</h1>

      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Delivery Info Display */}
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-green-800">
                {deliveryInfo.deliveryType === 'pickup' ? '🛍️ Pickup Order' : '🚚 Delivery Order'}
              </p>
              {deliveryInfo.deliveryType === 'delivery' && deliveryInfo.address && (
                <p className="text-sm text-green-700 mt-1">
                  Address: {deliveryInfo.address}
                </p>
              )}
            </div>
            {deliveryInfo.deliveryType === 'pickup' && (
              <span className="text-green-600 font-bold">Free</span>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2">Name</label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
            />
          </div>

          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2">Email</label>
            <input
              type="email"
              name="customerEmail"
              value={formData.customerEmail}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
            />
          </div>

          {!showOTP ? (
            <>
              <div className="mb-6">
                <label className="block text-lg font-semibold mb-2">Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-lg font-semibold mb-2">Expiry Date</label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    placeholder="MM/YY"
                    maxLength="5"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-lg font-semibold mb-2">CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleChange}
                    placeholder="123"
                    maxLength="3"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="mb-6">
              <label className="block text-lg font-semibold mb-2">Enter OTP</label>
              <p className="text-sm text-gray-600 mb-2">Demo OTP: 1234</p>
              <input
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                placeholder="Enter 4-digit OTP"
                maxLength="4"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
              />
            </div>
          )}

          {/* Order Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-3">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    {deliveryInfo.deliveryType === 'pickup' ? (
                      <span className="text-green-600 font-semibold">Free</span>
                    ) : (
                      <span className="text-red-600 font-semibold">€{deliveryCharge.toFixed(2)}</span>
                    )}
                  </div>
              {deliveryInfo.deliveryType === 'delivery' && deliveryInfo.distance > 0 && (
                <div className="text-xs text-gray-600 pt-1 border-t">
                  Distance: {deliveryInfo.distance.toFixed(2)} km
                </div>
              )}
              <div className="border-t pt-2 mt-2 flex justify-between text-lg font-bold">
                <span>Total Amount</span>
                <span className="text-green-600">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? 'Processing...' : showOTP ? 'Verify & Pay' : 'Continue to OTP'}
          </button>
        </form>

        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 font-semibold">🔒 Secure Payment</p>
          <p className="text-green-700 text-sm mt-1">
            This is a demo payment system. Your information is safe.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Payment;

