import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { FaPrint, FaChartLine, FaCalendarAlt, FaDollarSign, FaShoppingCart } from 'react-icons/fa';

const AdminSalesReport = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [period, setPeriod] = useState('daily');
  const [report, setReport] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  React.useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchStats();
    fetchReport();
  }, [period]);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/sales/stats`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchReport = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/sales/report?period=${period}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setReport(response.data);
    } catch (error) {
      console.error('Error fetching report:', error);
      alert('Failed to load sales report');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    if (!report) return;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Sales Report - ${period}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 1000px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #000;
      padding-bottom: 20px;
      margin-bottom: 20px;
    }
    .summary {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin: 20px 0;
    }
    .summary-card {
      border: 1px solid #ddd;
      padding: 15px;
      border-radius: 5px;
    }
    .summary-card h3 {
      margin-top: 0;
      color: #333;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 10px;
      text-align: left;
    }
    th {
      background-color: #f2f2f2;
      font-weight: bold;
    }
    .footer {
      margin-top: 40px;
      text-align: center;
      color: #666;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>American Pizza</h1>
    <h2>Sales Report - ${period.toUpperCase()}</h2>
    <p>Period: ${new Date(report.startDate).toLocaleDateString()} to ${new Date(report.endDate).toLocaleDateString()}</p>
  </div>
  
  <div class="summary">
    <div class="summary-card">
      <h3>Total Sales</h3>
      <p style="font-size: 24px; font-weight: bold;">$${report.summary.totalSales.toFixed(2)}</p>
    </div>
    <div class="summary-card">
      <h3>Total Orders</h3>
      <p style="font-size: 24px; font-weight: bold;">${report.summary.totalOrders}</p>
    </div>
    <div class="summary-card">
      <h3>Average Order Value</h3>
      <p style="font-size: 24px; font-weight: bold;">$${report.summary.averageOrderValue.toFixed(2)}</p>
    </div>
    <div class="summary-card">
      <h3>Delivery Charges</h3>
      <p style="font-size: 24px; font-weight: bold;">$${report.summary.totalDeliveryCharges.toFixed(2)}</p>
    </div>
  </div>
  
  <h2>Order Status Breakdown</h2>
  <table>
    <tr>
      <th>Status</th>
      <th>Count</th>
    </tr>
    <tr><td>Pending</td><td>${report.summary.statusCounts.Pending}</td></tr>
    <tr><td>Preparing</td><td>${report.summary.statusCounts.Preparing}</td></tr>
    <tr><td>Out for Delivery</td><td>${report.summary.statusCounts['Out for Delivery']}</td></tr>
    <tr><td>Delivered</td><td>${report.summary.statusCounts.Delivered}</td></tr>
  </table>
  
  <h2>Order Details</h2>
  <table>
    <thead>
      <tr>
        <th>Order ID</th>
        <th>Customer</th>
        <th>Date</th>
        <th>Total</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      ${report.orders.map(order => `
        <tr>
          <td>${order._id.slice(-8)}</td>
          <td>${order.customerName}</td>
          <td>${new Date(order.createdAt).toLocaleString()}</td>
          <td>$${order.totalAmount.toFixed(2)}</td>
          <td>${order.orderStatus}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
  
  <div class="footer">
    <p>Generated on ${new Date().toLocaleString()}</p>
    <p>American Pizza - Sales Report</p>
  </div>
</body>
</html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  if (!user || !user.isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Sales Report</h1>
        {report && (
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            <FaPrint />
            Print Report
          </button>
        )}
      </div>

      {/* Quick Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Today</p>
                <p className="text-2xl font-bold text-green-600">${stats.today.sales.toFixed(2)}</p>
                <p className="text-sm text-gray-600 mt-1">{stats.today.orders} orders</p>
              </div>
              <FaCalendarAlt className="text-4xl text-green-600 opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">This Week</p>
                <p className="text-2xl font-bold text-blue-600">${stats.week.sales.toFixed(2)}</p>
                <p className="text-sm text-gray-600 mt-1">{stats.week.orders} orders</p>
              </div>
              <FaChartLine className="text-4xl text-blue-600 opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">This Month</p>
                <p className="text-2xl font-bold text-purple-600">${stats.month.sales.toFixed(2)}</p>
                <p className="text-sm text-gray-600 mt-1">{stats.month.orders} orders</p>
              </div>
              <FaDollarSign className="text-4xl text-purple-600 opacity-50" />
            </div>
          </div>
        </div>
      )}

      {/* Period Selector */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex items-center gap-4">
          <label className="text-lg font-semibold">Report Period:</label>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>

      {/* Report Content */}
      {loading ? (
        <div className="text-center py-16">
          <div className="text-2xl">Loading report...</div>
        </div>
      ) : report ? (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <FaDollarSign className="text-3xl text-green-600" />
                <span className="text-2xl font-bold text-green-600">
                  ${report.summary.totalSales.toFixed(2)}
                </span>
              </div>
              <p className="text-gray-600">Total Sales</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <FaShoppingCart className="text-3xl text-blue-600" />
                <span className="text-2xl font-bold text-blue-600">
                  {report.summary.totalOrders}
                </span>
              </div>
              <p className="text-gray-600">Total Orders</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <FaChartLine className="text-3xl text-purple-600" />
                <span className="text-2xl font-bold text-purple-600">
                  ${report.summary.averageOrderValue.toFixed(2)}
                </span>
              </div>
              <p className="text-gray-600">Average Order Value</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <FaTruck className="text-3xl text-orange-600" />
                <span className="text-2xl font-bold text-orange-600">
                  ${report.summary.totalDeliveryCharges.toFixed(2)}
                </span>
              </div>
              <p className="text-gray-600">Delivery Charges</p>
            </div>
          </div>

          {/* Status Breakdown */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Order Status Breakdown</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <p className="text-3xl font-bold text-yellow-600">{report.summary.statusCounts.Pending}</p>
                <p className="text-gray-600">Pending</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-3xl font-bold text-blue-600">{report.summary.statusCounts.Preparing}</p>
                <p className="text-gray-600">Preparing</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-3xl font-bold text-purple-600">{report.summary.statusCounts['Out for Delivery']}</p>
                <p className="text-gray-600">Out for Delivery</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-3xl font-bold text-green-600">{report.summary.statusCounts.Delivered}</p>
                <p className="text-gray-600">Delivered</p>
              </div>
            </div>
          </div>

          {/* Order Details Table */}
          <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
            <h2 className="text-2xl font-bold p-6 pb-4">Order Details</h2>
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left">Order ID</th>
                  <th className="px-6 py-4 text-left">Customer</th>
                  <th className="px-6 py-4 text-left">Date</th>
                  <th className="px-6 py-4 text-left">Total</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Type</th>
                </tr>
              </thead>
              <tbody>
                {report.orders.map((order) => (
                  <tr key={order._id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-sm">{order._id.slice(-8)}</td>
                    <td className="px-6 py-4">{order.customerName}</td>
                    <td className="px-6 py-4 text-sm">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-semibold">${order.totalAmount.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.orderStatus === 'Pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : order.orderStatus === 'Preparing'
                            ? 'bg-blue-100 text-blue-800'
                            : order.orderStatus === 'Out for Delivery'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.deliveryType === 'pickup'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}
                      >
                        {order.deliveryType === 'pickup' ? 'Pickup' : 'Delivery'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {report.orders.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600">No orders found for this period</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-600">No report data available</p>
        </div>
      )}
    </div>
  );
};

export default AdminSalesReport;




