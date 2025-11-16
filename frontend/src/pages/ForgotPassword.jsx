import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState('request'); // 'request' or 'reset'
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
      setMessage(response.data.message);
      setResetToken(response.data.resetToken);
      setStep('reset');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send reset token');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await axios.post(`${API_URL}/auth/reset-password/${resetToken}`, {
        password: newPassword,
      });
      setMessage('Password reset successful! You can now login with your new password.');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          {step === 'request' ? 'Forgot Password' : 'Reset Password'}
        </h1>

        {step === 'request' ? (
          <form onSubmit={handleRequestReset}>
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
            {message && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{message}</div>}

            <div className="mb-6">
              <label className="block text-lg font-semibold mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-red-700 transition disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Reset Token'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
            {message && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{message}</div>}

            <div className="mb-6">
              <label className="block text-lg font-semibold mb-2">Reset Token</label>
              <input
                type="text"
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                placeholder="Enter reset token"
              />
              <p className="text-sm text-gray-600 mt-2">
                Check your email for the reset token (or use the token shown above)
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-lg font-semibold mb-2">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength="6"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                placeholder="Enter new password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 mb-4"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>

            <button
              type="button"
              onClick={() => setStep('request')}
              className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg text-lg font-semibold hover:bg-gray-300 transition"
            >
              Back
            </button>
          </form>
        )}

        <p className="text-center mt-6">
          Remember your password?{' '}
          <Link to="/login" className="text-red-600 hover:underline font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;

