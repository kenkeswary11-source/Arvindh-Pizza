import React, { useState } from 'react';
import axios from 'axios';
import { FaSearch, FaClock, FaUtensils, FaTruck, FaCheckCircle } from 'react-icons/fa';

const Tracking = () => {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderId.trim()) {
      setError('Please enter an order ID');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.get(`${API_URL}/orders/${orderId}`);
      setOrder(response.data);
    } catch (error) {
      setError('Order not found. Please check your order ID.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return <FaClock className="text-yellow-500" />;
      case 'Preparing':
        return <FaUtensils className="text-blue-500" />;
      case 'Out for Delivery':
        return <FaTruck className="text-purple-500" />;
      case 'Delivered':
        return <FaCheckCircle className="text-green-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Preparing':
        return 'bg-blue-100 text-blue-800';
      case 'Out for Delivery':
        return 'bg-purple-100 text-purple-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center">Track Your Order</h1>

      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <form onSubmit={handleTrack} className="flex gap-4">
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="Enter your Order ID"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 flex items-center gap-2"
          >
            <FaSearch />
            {loading ? 'Tracking...' : 'Track'}
          </button>
        </form>
        {error && <p className="text-red-600 mt-4">{error}</p>}
      </div>

      {order && (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">Order Details</h2>
            <div className="flex items-center gap-4 mb-4">
              <div className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 ${getStatusColor(order.orderStatus)}`}>
                {getStatusIcon(order.orderStatus)}
                {order.orderStatus}
              </div>
            </div>
            <p className="text-gray-600">
              <strong>Order ID:</strong> {order._id}
            </p>
            <p className="text-gray-600">
              <strong>Customer:</strong> {order.customerName}
            </p>
            <p className="text-gray-600">
              <strong>Total Amount:</strong> ${order.totalAmount.toFixed(2)}
            </p>
            <p className="text-gray-600">
              <strong>Order Date:</strong> {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {order.orderStatus === 'Delivered' && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <FaCheckCircle className="text-4xl text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-green-600 mb-2">Delivery Successful!</h3>
              <p className="text-green-700">Thank you for choosing American Pizza!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Tracking;

