import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import { FaClock, FaUtensils, FaTruck, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { API_URL, SOCKET_URL } from '../config/api';

const LiveTracking = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Fetch initial order data
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`${API_URL}/orders/${orderId}`);
        setOrder(response.data);
        setError('');
      } catch (error) {
        setError('Order not found. Please check your order ID.');
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId, API_URL]);

  useEffect(() => {
    // Connect to Socket.io for real-time updates
    if (!orderId) return;
    
    if (!SOCKET_URL) {
      console.warn('Socket.io connection skipped: VITE_SOCKET_URL not configured');
      return;
    }

    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      console.log('Socket.io connected for order tracking');
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket.io connection error:', error);
      setError('Unable to connect to real-time updates. Please refresh the page.');
    });

    setSocket(newSocket);

    // Join the order room
    newSocket.emit('joinOrderRoom', orderId);

    // Listen for order status updates
    newSocket.on('orderStatusUpdate', (data) => {
      if (data.orderId === orderId) {
        if (data.order) {
          // Full order update
          setOrder(data.order);
        } else {
          // Status only update
          setOrder(prev => prev ? { ...prev, orderStatus: data.status } : null);
        }
      }
    });

    return () => {
      newSocket.emit('leaveOrderRoom', orderId);
      newSocket.disconnect();
    };
  }, [orderId, SOCKET_URL]);

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Preparing':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Ready for Pickup':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Out for Delivery':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Delivered':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusSteps = () => {
    // For pickup orders, show different steps
    const isPickup = order?.deliveryType === 'pickup';
    const statuses = isPickup 
      ? ['Pending', 'Preparing', 'Ready for Pickup', 'Delivered']
      : ['Pending', 'Preparing', 'Out for Delivery', 'Delivered'];
    const currentIndex = statuses.indexOf(order?.orderStatus || 'Pending');
    
    return statuses.map((status, index) => {
      const isActive = index <= currentIndex;
      const isCurrent = index === currentIndex;
      
      return {
        status,
        isActive,
        isCurrent,
        icon: getStatusIcon(status),
      };
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <FaSpinner className="animate-spin text-4xl text-green-600 mx-auto mb-4" />
        <div className="text-2xl">Loading order...</div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
          <p className="text-red-600 text-xl">{error || 'Order not found'}</p>
        </div>
      </div>
    );
  }

  const statusSteps = getStatusSteps();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Live Order Tracking</h1>
          <div className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 border-2 ${getStatusColor(order.orderStatus)}`}>
            {getStatusIcon(order.orderStatus)}
            {order.orderStatus}
          </div>
        </div>

        {/* Order ID */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Order ID</p>
          <p className="text-lg font-mono font-semibold">{order._id}</p>
        </div>

        {/* Status Progress Steps */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Order Progress</h2>
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200">
              <div
                className="h-1 bg-green-600 transition-all duration-500"
                style={{
                  width: `${(statusSteps.findIndex(s => s.isCurrent) + 1) * 33.33}%`,
                }}
              />
            </div>

            {/* Status Steps */}
            <div className="relative flex justify-between">
              {statusSteps.map((step, index) => (
                <div key={step.status} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                      step.isActive
                        ? 'bg-green-600 border-green-600 text-white scale-110'
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}
                  >
                    {step.icon}
                  </div>
                  <p
                    className={`mt-2 text-sm font-semibold text-center ${
                      step.isActive ? 'text-green-600' : 'text-gray-400'
                    }`}
                  >
                    {step.status}
                  </p>
                  {step.isCurrent && (
                    <p className="text-xs text-green-600 mt-1 animate-pulse">Current</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Customer</p>
            <p className="font-semibold">{order.customerName}</p>
            <p className="text-sm text-gray-600">{order.customerEmail}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Order Date</p>
            <p className="font-semibold">{new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Order Type</p>
            <p className="font-semibold">
              {order.deliveryType === 'pickup' ? '🛍️ Pickup' : '🚚 Delivery'}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Total Amount</p>
            <p className="font-semibold text-lg text-green-600">${order.totalAmount.toFixed(2)}</p>
          </div>
        </div>

        {order.deliveryType === 'delivery' && order.address && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Delivery Address</p>
            <p className="font-semibold">{order.address}</p>
            {order.distance > 0 && (
              <p className="text-sm text-gray-600 mt-1">Distance: {order.distance.toFixed(2)} km</p>
            )}
          </div>
        )}

        {/* Order Items */}
        <div className="border-t pt-6">
          <h3 className="text-xl font-semibold mb-4">Order Items</h3>
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          {order.deliveryCharge > 0 && (
            <div className="mt-4 pt-4 border-t flex justify-between">
              <span className="text-gray-600">Delivery Charge</span>
              <span className="font-semibold">${order.deliveryCharge.toFixed(2)}</span>
            </div>
          )}
        </div>

        {/* Real-time indicator */}
        {socket && (
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-green-600">
            <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
            <span>Live tracking active</span>
          </div>
        )}

        {order.orderStatus === 'Delivered' && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <FaCheckCircle className="text-4xl text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-green-600 mb-2">Delivery Successful!</h3>
            <p className="text-green-700">Thank you for choosing American Pizza!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveTracking;

