const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/database');

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);

// CORS configuration - allow all localhost origins in development
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // In development, allow any localhost or 127.0.0.1 origin
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      callback(null, true);
    } else if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
      // Allow production URL if set
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));

const io = socketIo(server, {
  cors: corsOptions
});

// Store io instance in app for use in routes
app.set('io', io);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/offers', require('./routes/offerRoutes'));
app.use('/api/delivery', require('./routes/deliveryRoutes'));
app.use('/api/sales', require('./routes/salesRoutes')); // New sales routes

// Socket.io connection
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Join order tracking room
  socket.on('joinOrderRoom', (orderId) => {
    socket.join(`order:${orderId}`);
    console.log(`Client ${socket.id} joined order room: order:${orderId}`);
  });

  // Leave order tracking room
  socket.on('leaveOrderRoom', (orderId) => {
    socket.leave(`order:${orderId}`);
    console.log(`Client ${socket.id} left order room: order:${orderId}`);
  });

  // Join user-specific room for notifications
  socket.on('joinUserRoom', (userId) => {
    socket.join(`user:${userId}`);
    console.log(`Client ${socket.id} joined user room: user:${userId}`);
  });

  // Leave user-specific room
  socket.on('leaveUserRoom', (userId) => {
    socket.leave(`user:${userId}`);
    console.log(`Client ${socket.id} left user room: user:${userId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

