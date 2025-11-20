// Centralized API configuration
// These will be replaced at build time by Vite
// For Docker: Set VITE_API_URL and VITE_SOCKET_URL in docker-compose.yml build args
// For Vercel: Set in Vercel Dashboard environment variables

const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (import.meta.env.DEV) {
    return 'http://localhost:5000';
  }

  // Production fallback - but this should not happen if VITE_API_URL is set
  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    console.warn('⚠️ VITE_API_URL is not set! Using fallback:', origin);
    console.warn('⚠️ Please set VITE_API_URL in Vercel environment variables!');
    console.warn('⚠️ Expected: VITE_API_URL=https://arvindh-pizza.onrender.com/api');
    return origin;  // Fallback (will likely fail, but prevents crash)
  }

  console.error('VITE_API_URL is not set! Please configure it in environment variables.');
  return '';
};


const getSocketUrl = () => {
  if (import.meta.env.VITE_SOCKET_URL) {
    return import.meta.env.VITE_SOCKET_URL;
  }
  if (import.meta.env.DEV) {
    return 'http://localhost:5000';
  }
  // Production fallback: construct from API_URL if available
  const apiUrl = getApiUrl();
  if (apiUrl && apiUrl.includes('/api')) {
    return apiUrl.replace('/api', '');
  }
  // Last resort: try to construct from window location
  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    // Extract port if backend is on different port (e.g., localhost:5000)
    // For Docker, if backend is exposed, use the exposed port
    // Default: assume backend is on same origin (if proxied through NGINX)
    return origin;
  }
  console.error('VITE_SOCKET_URL is not set! Please configure it in environment variables.');
  return '';
};

const API_URL = getApiUrl();
const SOCKET_URL = getSocketUrl();

// Helper to get base URL (without /api)
export const getBaseUrl = () => {
  if (!API_URL) {
    // Fallback: try to construct from current origin
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return '';
  }
  
  if (API_URL.includes('/api')) {
    return API_URL.replace('/api', '');
  }
  
  // If API_URL doesn't have /api, return as is (might be base URL)
  return API_URL;
};

// Helper to get image URL
export const getImageUrl = (imageName) => {
  if (!imageName) {
    return 'https://via.placeholder.com/400x300?text=No+Image';
  }
  
  // If imageName is already a full URL (Cloudinary, external, etc.), return it as-is
  if (imageName.startsWith('http://') || imageName.startsWith('https://')) {
    return imageName;
  }
  
  // Otherwise, treat it as a local filename and construct the URL
  const baseUrl = getBaseUrl();
  if (!baseUrl) {
    // Fallback: relative path
    return `/uploads/${imageName}`;
  }
  
  return `${baseUrl}/uploads/${imageName}`;
};

export { API_URL, SOCKET_URL };

