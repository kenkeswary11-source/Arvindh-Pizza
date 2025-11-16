import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FaShoppingCart, FaUser, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/products', label: 'Menu' },
    { path: '/reviews', label: 'Reviews' },
    { path: '/tracking', label: 'Track Order' },
  ];

  return (
    <nav className="bg-gradient-to-r from-green-600 via-green-700 to-green-600 text-white shadow-2xl sticky top-0 z-50 backdrop-blur-md bg-opacity-95 border-b border-white border-opacity-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 text-2xl font-bold hover:text-yellow-300 transition-all duration-300 transform hover:scale-105 group"
          >
            <div className="relative">
              <span className="text-4xl group-hover:rotate-12 transition-transform duration-300 inline-block">🍕</span>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping opacity-75"></span>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"></span>
            </div>
            <div className="flex flex-col">
              <span className="hidden sm:inline-block bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-300 bg-clip-text text-transparent font-extrabold text-2xl tracking-tight">
                American Pizza
              </span>
              <span className="hidden sm:block text-xs text-green-200 font-light">Delicious & Fresh</span>
              <span className="sm:hidden text-xl">Pizza</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 group ${
                  isActive(link.path)
                    ? 'bg-white bg-opacity-25 text-yellow-300 shadow-lg shadow-yellow-300/20 scale-105'
                    : 'hover:bg-white hover:bg-opacity-15 hover:text-yellow-300 hover:scale-105'
                }`}
              >
                <span className="relative z-10">{link.label}</span>
                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-300 rounded-full"></span>
                )}
                <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400/20 to-yellow-300/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Link>
            ))}
            {user && user.isAdmin && (
              <Link
                to="/admin"
                className={`relative px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 group ${
                  isActive('/admin')
                    ? 'bg-gradient-to-r from-yellow-400/30 to-yellow-300/30 text-yellow-300 shadow-lg shadow-yellow-300/20 scale-105'
                    : 'hover:bg-white hover:bg-opacity-15 hover:text-yellow-300 hover:scale-105'
                }`}
              >
                <span className="relative z-10">Admin</span>
                {isActive('/admin') && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-300 rounded-full"></span>
                )}
              </Link>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-3 rounded-xl hover:bg-white hover:bg-opacity-15 transition-all duration-300 group hover:scale-110"
            >
              <FaShoppingCart className="text-xl group-hover:rotate-12 transition-all duration-300" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-green-800 rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold shadow-lg shadow-yellow-400/50 animate-bounce border-2 border-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="flex items-center space-x-3 bg-white bg-opacity-10 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-white border-opacity-20 shadow-lg">
                <Link
                  to="/update-profile"
                  className="flex items-center space-x-3 hover:text-yellow-300 transition-all duration-300 group"
                >
                  <div className="bg-gradient-to-br from-white/30 to-white/10 rounded-full p-2.5 group-hover:from-yellow-400/40 group-hover:to-yellow-300/40 transition-all duration-300 shadow-md group-hover:shadow-yellow-300/50">
                    <FaUser className="text-sm" />
                  </div>
                  <span className="font-semibold">{user.name}</span>
                </Link>
                <div className="h-8 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 hover:text-yellow-300 transition-all duration-300 group px-2 py-1 rounded-lg hover:bg-white hover:bg-opacity-10"
                >
                  <FaSignOutAlt className="group-hover:rotate-12 transition-transform duration-300" />
                  <span className="font-semibold">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-5 py-2.5 rounded-xl font-semibold hover:bg-white hover:bg-opacity-15 transition-all duration-300 hover:scale-105 border border-white border-opacity-20"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 text-green-800 px-6 py-2.5 rounded-xl font-bold hover:from-yellow-300 hover:via-yellow-200 hover:to-yellow-300 transform hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-2xl shadow-yellow-400/50 hover:shadow-yellow-300/70 relative overflow-hidden group"
                >
                  <span className="relative z-10">Sign Up</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-3 rounded-xl hover:bg-white hover:bg-opacity-15 transition-all duration-300 hover:scale-110 relative"
          >
            {mobileMenuOpen ? (
              <FaTimes className="text-2xl rotate-180 transition-transform duration-300" />
            ) : (
              <FaBars className="text-2xl" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white border-opacity-20 animate-slideDown backdrop-blur-md bg-green-700/50">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-5 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    isActive(link.path)
                      ? 'bg-white bg-opacity-25 text-yellow-300 shadow-lg scale-105'
                      : 'hover:bg-white hover:bg-opacity-15 hover:text-yellow-300 hover:scale-105'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {user && user.isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-5 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    isActive('/admin')
                      ? 'bg-gradient-to-r from-yellow-400/30 to-yellow-300/30 text-yellow-300 shadow-lg scale-105'
                      : 'hover:bg-white hover:bg-opacity-15 hover:text-yellow-300 hover:scale-105'
                  }`}
                >
                  Admin
                </Link>
              )}
              <Link
                to="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="px-5 py-3 rounded-xl font-semibold hover:bg-white hover:bg-opacity-15 transition-all duration-300 hover:scale-105 flex items-center justify-between"
              >
                <span className="flex items-center space-x-2">
                  <FaShoppingCart />
                  <span>Cart</span>
                </span>
                {cartCount > 0 && (
                  <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-green-800 rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold shadow-lg border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </Link>
              {user ? (
                <>
                  <Link
                    to="/update-profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-5 py-3 rounded-xl font-semibold hover:bg-white hover:bg-opacity-15 transition-all duration-300 hover:scale-105 flex items-center space-x-3"
                  >
                    <div className="bg-white bg-opacity-20 rounded-full p-2">
                      <FaUser />
                    </div>
                    <span>{user.name}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-5 py-3 rounded-xl font-semibold hover:bg-white hover:bg-opacity-15 transition-all duration-300 hover:scale-105 flex items-center space-x-3 text-left"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-5 py-3 rounded-xl font-semibold hover:bg-white hover:bg-opacity-15 transition-all duration-300 hover:scale-105 text-center border border-white border-opacity-20"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-green-800 px-5 py-3 rounded-xl font-bold text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

