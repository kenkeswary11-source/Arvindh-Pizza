import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const PaymentSuccess = () => {
  const location = useLocation();
  const orderId = location.state?.orderId;

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-lg shadow-lg p-12">
          <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-green-600 mb-4">Payment Successful!</h1>
          <p className="text-xl text-gray-700 mb-6">
            Thank you for your order. Your pizza is being prepared!
          </p>
          {orderId && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-2">Order ID</p>
              <p className="text-2xl font-bold text-gray-800">{orderId}</p>
              <p className="text-sm text-gray-600 mt-2">
                Save this ID to track your order
              </p>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {orderId && (
              <Link
                to={`/tracking/${orderId}`}
                className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition"
              >
                Live Track Order
              </Link>
            )}
            <Link
              to="/tracking"
              className="bg-red-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-red-700 transition"
            >
              Track Order
            </Link>
            <Link
              to="/products"
              className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-300 transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;

