import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { FaPrint, FaArrowLeft, FaClock, FaUtensils, FaTruck, FaCheckCircle } from 'react-icons/fa';
import { API_URL } from '../../config/api';

const AdminOrderDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await axios.get(`${API_URL}/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setOrder(response.data);
    } catch (error) {
      console.error('Error fetching order:', error);
      alert('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = async () => {
    try {
      const response = await axios.get(`${API_URL}/orders/${id}/print`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        responseType: 'blob',
      });
      
      // Create blob URL and open in new window for printing
      const blob = new Blob([response.data], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const printWindow = window.open(url, '_blank');
      
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      }
    } catch (error) {
      console.error('Error printing order:', error);
      alert('Failed to generate print view');
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

  if (!user || !user.isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-2xl text-red-600">Order not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/admin/orders')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition"
        >
          <FaArrowLeft />
          Back to Orders
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          <FaPrint />
          Print Order
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Order Details</h1>
          <div className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 ${getStatusColor(order.orderStatus)}`}>
            {getStatusIcon(order.orderStatus)}
            {order.orderStatus}
          </div>
        </div>

        {/* Order Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Order ID</p>
            <p className="font-mono font-semibold">{order._id}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Order Date</p>
            <p className="font-semibold">{new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Customer Name</p>
            <p className="font-semibold">{order.customerName}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Customer Email</p>
            <p className="font-semibold">{order.customerEmail}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Order Type</p>
            <p className="font-semibold">
              {order.deliveryType === 'pickup' ? '🛍️ Pickup' : '🚚 Delivery'}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Payment Status</p>
            <p className="font-semibold capitalize">{order.paymentStatus}</p>
          </div>
        </div>

        {order.deliveryType === 'delivery' && order.address && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Delivery Address</p>
            <p className="font-semibold">{order.address}</p>
            {order.distance > 0 && (
              <p className="text-sm text-gray-600 mt-1">Distance: {order.distance.toFixed(2)} km</p>
            )}
            {order.deliveryCharge > 0 && (
              <p className="text-sm text-gray-600 mt-1">Delivery Charge: ${order.deliveryCharge.toFixed(2)}</p>
            )}
          </div>
        )}

        {/* Order Items */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Order Items</h2>
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-4">
                  {item.image && (
                    <img
                      src={`${API_URL.replace('/api', '')}/uploads/${item.image}`}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    <p className="text-sm text-gray-600">Price: ${item.price.toFixed(2)} each</p>
                  </div>
                </div>
                <p className="font-semibold text-lg">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="border-t pt-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold">Subtotal</span>
            <span className="text-lg">${(order.totalAmount - (order.deliveryCharge || 0)).toFixed(2)}</span>
          </div>
          {order.deliveryCharge > 0 && (
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Delivery Charge</span>
              <span className="text-lg">${order.deliveryCharge.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between items-center pt-4 border-t">
            <span className="text-2xl font-bold">Total Amount</span>
            <span className="text-2xl font-bold text-green-600">${order.totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetails;




