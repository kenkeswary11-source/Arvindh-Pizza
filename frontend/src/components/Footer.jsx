import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-red-500">American Pizza</h3>
            <p className="text-gray-400 mb-4">
              Delicious, fresh, and made with love. We serve the best pizzas in town with quality ingredients and fast delivery.
            </p>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-red-500 transition text-2xl"
                aria-label="Facebook"
              >
                <FaFacebook />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-red-500 transition text-2xl"
                aria-label="Twitter"
              >
                <FaTwitter />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-red-500 transition text-2xl"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-red-500 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-red-500 transition">
                  Menu
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="text-gray-400 hover:text-red-500 transition">
                  Reviews
                </Link>
              </li>
              <li>
                <Link to="/tracking" className="text-gray-400 hover:text-red-500 transition">
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-xl font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/login" className="text-gray-400 hover:text-red-500 transition">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-gray-400 hover:text-red-500 transition">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-400 hover:text-red-500 transition">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <a href="#faq" className="text-gray-400 hover:text-red-500 transition">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-green-500 mt-1 flex-shrink-0" />
                <span className="text-gray-400">
                  Bahnhof str.119, 47137 Duisburg
                </span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhone className="text-green-500 flex-shrink-0" />
                <a href="tel:+4915213759078" className="text-gray-400 hover:text-green-500 transition">
                  015213759078
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-green-500 flex-shrink-0" />
                <a href="mailto:kenkeswary11@icloud.com" className="text-gray-400 hover:text-green-500 transition">
                  kenkeswary11@icloud.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} American Pizza. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#privacy" className="text-gray-400 hover:text-red-500 transition">
                Privacy Policy
              </a>
              <a href="#terms" className="text-gray-400 hover:text-red-500 transition">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

