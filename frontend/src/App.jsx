import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Payment from './pages/Payment';
import PaymentSuccess from './pages/PaymentSuccess';
import Tracking from './pages/Tracking';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Reviews from './pages/Reviews';
import ForgotPassword from './pages/ForgotPassword';
import UpdateProfile from './pages/UpdateProfile';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminAddProduct from './pages/admin/AdminAddProduct';
import AdminEditProduct from './pages/admin/AdminEditProduct';
import AdminOrders from './pages/admin/AdminOrders';
import AdminOffers from './pages/admin/AdminOffers';
import AdminAddOffer from './pages/admin/AdminAddOffer';
import AdminEditOffer from './pages/admin/AdminEditOffer';
import AdminOrderDetails from './pages/admin/AdminOrderDetails';
import AdminSalesReport from './pages/admin/AdminSalesReport';
import LiveTracking from './pages/LiveTracking';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

// Inner component to access auth context
const AppContent = () => {
  const { user } = useAuth();
  return (
    <NotificationProvider userId={user?._id || user?.id}>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/tracking" element={<Tracking />} />
              <Route path="/tracking/:orderId" element={<LiveTracking />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/update-profile" element={<UpdateProfile />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/products/add" element={<AdminAddProduct />} />
              <Route path="/admin/products/edit/:id" element={<AdminEditProduct />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/orders/:id" element={<AdminOrderDetails />} />
              <Route path="/admin/sales" element={<AdminSalesReport />} />
              <Route path="/admin/offers" element={<AdminOffers />} />
              <Route path="/admin/offers/add" element={<AdminAddOffer />} />
              <Route path="/admin/offers/edit/:id" element={<AdminEditOffer />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </NotificationProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

