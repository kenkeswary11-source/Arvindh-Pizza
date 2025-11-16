import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import io from 'socket.io-client';
import { FaCheckCircle, FaClock, FaUtensils, FaTruck } from 'react-icons/fa';

const AdminOrders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

  React.useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchOrders();
    
    // Connect to Socket.io
    const socket = io(SOCKET_URL);
    
    socket.on('newOrder', (newOrder) => {
      // Play beep sound using Web Audio API
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
      } catch (e) {
        // Fallback: browser notification
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('New Order!', {
            body: `Order ID: ${newOrder._id.slice(-8)}\nTotal: $${newOrder.totalAmount.toFixed(2)}`,
          });
        }
      }
      
      // Show alert
      alert(`🔔 New Order Received!\nOrder ID: ${newOrder._id}\nTotal: $${newOrder.totalAmount.toFixed(2)}`);
      
      // Refresh orders
      fetchOrders();
    });

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/orders`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await axios.put(
        `${API_URL}/orders/${orderId}/status`,
        { orderStatus: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return <FaClock className="text-yellow-500" />;
      case 'Preparing':
        return <FaUtensils className="text-blue-500" />;
      case 'Ready for Pickup':
        return <FaCheckCircle className="text-orange-500" />;
      case 'Out for Delivery':
        return <FaTruck className="text-purple-500" />;
      case 'Delivered':
        return <FaCheckCircle className="text-green-500" />;
      default:
        return <FaClock className="text-gray-500" />;
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Manage Orders</h1>

      <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-4 text-left">Order ID</th>
              <th className="px-6 py-4 text-left">Customer</th>
              <th className="px-6 py-4 text-left">Type</th>
              <th className="px-6 py-4 text-left">Address</th>
              <th className="px-6 py-4 text-left">Items</th>
              <th className="px-6 py-4 text-left">Total</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Date</th>
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">
                  <Link
                    to={`/admin/orders/${order._id}`}
                    className="font-mono text-sm text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {order._id.slice(-8)}
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-semibold">{order.customerName}</p>
                    <p className="text-sm text-gray-600">{order.customerEmail}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    order.deliveryType === 'pickup'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {order.deliveryType === 'pickup' ? '🛍️ Pickup' : '🚚 Delivery'}
                  </span>
                  {order.deliveryType === 'delivery' && order.deliveryCharge > 0 && (
                    <p className="text-xs text-gray-600 mt-1">
                      ${order.deliveryCharge.toFixed(2)}
                    </p>
                  )}
                </td>
                <td className="px-6 py-4">
                  {order.deliveryType === 'delivery' && order.address ? (
                    <div>
                      <p className="text-sm">{order.address}</p>
                      {order.distance > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          {order.distance.toFixed(2)} km
                        </p>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">N/A</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {order.items.length} item(s)
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-semibold">${order.totalAmount.toFixed(2)}</p>
                    {order.deliveryCharge > 0 && (
                      <p className="text-xs text-gray-500">
                        (incl. ${order.deliveryCharge.toFixed(2)} delivery)
                      </p>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(order.orderStatus)}
                    <span>{order.orderStatus}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  {new Date(order.createdAt).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <select
                    value={order.orderStatus}
                    onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Preparing">Preparing</option>
                    <option value="Ready for Pickup">Ready for Pickup</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No orders yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;

