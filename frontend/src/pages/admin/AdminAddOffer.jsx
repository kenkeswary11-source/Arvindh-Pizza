import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const AdminAddOffer = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discount: '',
    code: '',
    validFrom: '',
    validUntil: '',
    minOrderAmount: '',
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  React.useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append('title', formData.title.trim());
      data.append('description', formData.description.trim());
      data.append('discount', formData.discount);
      data.append('code', formData.code.trim());
      data.append('validFrom', formData.validFrom);
      data.append('validUntil', formData.validUntil);
      if (formData.minOrderAmount && formData.minOrderAmount !== '') {
        data.append('minOrderAmount', formData.minOrderAmount);
      }
      if (image) {
        data.append('image', image);
      }

      await axios.post(
        `${API_URL}/offers`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      navigate('/admin/offers');
    } catch (error) {
      console.error('Error adding offer:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to add offer';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!user || !user.isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-4xl font-bold mb-8">Add New Offer</h1>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2">Offer Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
            />
            <p className="text-sm text-gray-600 mt-2">
              Upload an image for this offer (optional)
            </p>
            {image && (
              <div className="mt-4">
                <img
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  className="w-48 h-32 object-cover rounded-lg border border-gray-300"
                />
              </div>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
              placeholder="e.g., Weekend Special"
            />
          </div>

          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
              placeholder="e.g., Get 20% off on all orders this weekend"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-lg font-semibold mb-2">Discount (%) *</label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                required
                min="0"
                max="100"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-lg font-semibold mb-2">Offer Code *</label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent font-mono uppercase"
                placeholder="WEEKEND20"
                style={{ textTransform: 'uppercase' }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-lg font-semibold mb-2">Valid From *</label>
              <input
                type="datetime-local"
                name="validFrom"
                value={formData.validFrom}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-lg font-semibold mb-2">Valid Until *</label>
              <input
                type="datetime-local"
                name="validUntil"
                value={formData.validUntil}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2">Minimum Order Amount (Optional)</label>
            <input
              type="number"
              name="minOrderAmount"
              value={formData.minOrderAmount}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
              placeholder="0.00"
            />
            <p className="text-sm text-gray-600 mt-2">
              Leave empty or 0 for no minimum order requirement
            </p>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-red-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-red-700 transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Offer'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/offers')}
              className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddOffer;

