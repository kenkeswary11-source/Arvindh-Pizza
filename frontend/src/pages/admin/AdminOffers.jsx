import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { API_URL, getImageUrl } from '../../config/api';

const AdminOffers = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const response = await axios.get(`${API_URL}/offers/all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setOffers(response.data);
    } catch (error) {
      console.error('Error fetching offers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this offer?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/offers/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      fetchOffers();
    } catch (error) {
      console.error('Error deleting offer:', error);
      alert('Failed to delete offer');
    }
  };

  const toggleActive = async (offer) => {
    try {
      await axios.put(
        `${API_URL}/offers/${offer._id}`,
        { isActive: !offer.isActive },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      fetchOffers();
    } catch (error) {
      console.error('Error updating offer:', error);
      alert('Failed to update offer');
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Manage Offers</h1>
        <button
          onClick={() => navigate('/admin/offers/add')}
          className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition flex items-center gap-2"
        >
          <FaPlus />
          Add New Offer
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-4 text-left">Title</th>
              <th className="px-6 py-4 text-left">Code</th>
              <th className="px-6 py-4 text-left">Discount</th>
              <th className="px-6 py-4 text-left">Valid From</th>
              <th className="px-6 py-4 text-left">Valid Until</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {offers.map((offer) => (
              <tr key={offer._id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold">{offer.title}</td>
                <td className="px-6 py-4">
                  <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-mono font-semibold">
                    {offer.code}
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold text-red-600">{offer.discount}%</td>
                <td className="px-6 py-4 text-sm">
                  {new Date(offer.validFrom).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm">
                  {new Date(offer.validUntil).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleActive(offer)}
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      offer.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {offer.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-4">
                    <button
                      onClick={() => navigate(`/admin/offers/edit/${offer._id}`)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(offer._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {offers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No offers yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOffers;

