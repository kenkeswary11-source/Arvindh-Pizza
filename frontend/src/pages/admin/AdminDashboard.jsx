import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaBox, FaShoppingCart, FaPlus, FaTag, FaChartLine } from 'react-icons/fa';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user || !user.isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/admin/products"
          className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition transform hover:scale-105"
        >
          <FaBox className="text-4xl text-red-600 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Manage Products</h2>
          <p className="text-gray-600">View, add, edit, and delete products</p>
        </Link>

        <Link
          to="/admin/orders"
          className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition transform hover:scale-105"
        >
          <FaShoppingCart className="text-4xl text-red-600 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Manage Orders</h2>
          <p className="text-gray-600">View and update order status</p>
        </Link>

        <Link
          to="/admin/sales"
          className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition transform hover:scale-105"
        >
          <FaChartLine className="text-4xl text-green-600 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Sales Report</h2>
          <p className="text-gray-600">View and export sales reports</p>
        </Link>

        <Link
          to="/admin/offers"
          className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition transform hover:scale-105"
        >
          <FaTag className="text-4xl text-red-600 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Manage Offers</h2>
          <p className="text-gray-600">Create and manage special offers</p>
        </Link>

        <Link
          to="/admin/products/add"
          className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition transform hover:scale-105"
        >
          <FaPlus className="text-4xl text-red-600 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Add Product</h2>
          <p className="text-gray-600">Add a new product to the menu</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;

