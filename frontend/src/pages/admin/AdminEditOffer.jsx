import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const AdminEditOffer = () => {
  const { id } = useParams();
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
    isActive: true,
  });
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  React.useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchOffer();
  }, [id]);

  const fetchOffer = async () => {
    try {
      const response = await axios.get(`${API_URL}/offers/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const offer = response.data;
      
      // Format dates for datetime-local input
      const formatDate = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      };

      setFormData({
        title: offer.title,
        description: offer.description,
        discount: offer.discount,
        code: offer.code,
        validFrom: formatDate(offer.validFrom),
        validUntil: formatDate(offer.validUntil),
        minOrderAmount: offer.minOrderAmount || '',
        isActive: offer.isActive,
      });
      if (offer.image) {
        const baseUrl = API_URL.replace('/api', '') || 'http://localhost:5000';
        setCurrentImage(`${baseUrl}/uploads/${offer.image}`);
      }
    } catch (error) {
      console.error('Error fetching offer:', error);
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setCurrentImage(''); // Clear current image preview when new image is selected
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('discount', formData.discount);
      data.append('code', formData.code);
      data.append('validFrom', formData.validFrom);
      data.append('validUntil', formData.validUntil);
      data.append('isActive', formData.isActive);
      if (formData.minOrderAmount !== '') {
        data.append('minOrderAmount', formData.minOrderAmount);
      }
      if (image) {
        data.append('image', image);
      }

      await axios.put(
        `${API_URL}/offers/${id}`,
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
      console.error('Error updating offer:', error);
      alert(error.response?.data?.message || 'Failed to update offer');
    } finally {
      setLoading(false);
    }
  };

  if (!user || !user.isAdmin) {
    return null;
  }

  if (fetching) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-4xl font-bold mb-8">Edit Offer</h1>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2">Offer Image</label>
            {currentImage && !image && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Current Image:</p>
                <img
                  src={currentImage}
                  alt="Current offer"
                  className="w-48 h-32 object-cover rounded-lg border border-gray-300"
                />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
            />
            <p className="text-sm text-gray-600 mt-2">
              Upload a new image to replace the current one (optional)
            </p>
            {image && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">New Image Preview:</p>
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
            <label className="block text-lg font-semibold mb-2">Minimum Order Amount</label>
            <input
              type="number"
              name="minOrderAmount"
              value={formData.minOrderAmount}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
            />
          </div>

          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="mr-2 w-5 h-5"
              />
              <span className="text-lg font-semibold">Active</span>
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-red-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-red-700 transition disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Offer'}
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

export default AdminEditOffer;

