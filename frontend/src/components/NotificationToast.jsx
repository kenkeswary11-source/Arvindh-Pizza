import React, { useState, useEffect } from 'react';
import { FaBell, FaTimes, FaCheckCircle, FaStore } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const NotificationToast = ({ notification, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto-hide after 10 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade-out animation
    }, 10000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-20 right-4 z-50 animate-slideInRight">
      <div className="bg-white rounded-lg shadow-2xl border-l-4 border-green-600 max-w-md w-full p-4 flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <FaStore className="text-green-600 text-xl" />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                <FaBell className="text-green-600" />
                Order Ready for Pickup!
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                Your order <span className="font-semibold">#{notification.orderNumber}</span> is ready for pickup.
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                <FaCheckCircle className="text-green-600" />
                <span>Total: ${notification.order?.totalAmount?.toFixed(2) || '0.00'}</span>
              </div>
              <Link
                to={`/tracking/${notification.orderId}`}
                className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition"
                onClick={onClose}
              >
                View Order
              </Link>
            </div>
            <button
              onClick={() => {
                setIsVisible(false);
                setTimeout(onClose, 300);
              }}
              className="text-gray-400 hover:text-gray-600 transition flex-shrink-0"
            >
              <FaTimes />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationToast;





