# American Pizza Shop - Full Stack Web Application

A complete full-stack pizza shop website built with React, Tailwind CSS, Node.js (Express), and MongoDB.

## 🚀 Features

### Frontend (React + Tailwind CSS)
- ✅ Modern, elegant home page with hero section, featured pizzas, and offers
- ✅ Product listing page with category filtering
- ✅ Product details page with quantity selector
- ✅ Shopping cart with add/remove/update quantity
- ✅ Payment page with OTP simulation
- ✅ Delivery tracking by Order ID
- ✅ User authentication (Sign In/Sign Up) with JWT
- ✅ Customer review system with star ratings
- ✅ Admin panel for product and order management
- ✅ Real-time order notifications for admin (Socket.io)

### Backend (Node.js + Express + MongoDB)
- ✅ User authentication API with JWT and password hashing
- ✅ Product CRUD API with Multer image upload
- ✅ Cart/Order API with order tracking
- ✅ Review API
- ✅ Socket.io integration for real-time admin alerts
- ✅ MongoDB database with Mongoose

### Admin Panel
- ✅ Add product with image upload (no URL/filename needed)
- ✅ View, edit, and delete products
- ✅ Orders dashboard with real-time updates
- ✅ Change order status (Pending, Preparing, Out for Delivery, Delivered)
- ✅ Sound + popup notification on new orders

## 📁 Project Structure

```
American Pizza/
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── middleware/
│   │   ├── auth.js               # JWT authentication middleware
│   │   └── upload.js             # Multer image upload configuration
│   ├── models/
│   │   ├── User.js               # User model
│   │   ├── Product.js            # Product model
│   │   ├── Order.js              # Order model
│   │   └── Review.js             # Review model
│   ├── routes/
│   │   ├── authRoutes.js         # Authentication routes
│   │   ├── productRoutes.js      # Product CRUD routes
│   │   ├── orderRoutes.js        # Order routes
│   │   └── reviewRoutes.js       # Review routes
│   ├── uploads/                  # Uploaded images (created automatically)
│   ├── .env                      # Environment variables (create from .env.example)
│   ├── .env.example              # Example environment file
│   ├── .gitignore
│   ├── package.json
│   └── server.js                  # Express server with Socket.io
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   └── Navbar.js         # Navigation bar
    │   ├── context/
    │   │   ├── AuthContext.js     # Authentication context
    │   │   └── CartContext.js    # Shopping cart context
    │   ├── pages/
    │   │   ├── Home.js            # Home page
    │   │   ├── Products.js        # Product listing
    │   │   ├── ProductDetails.js  # Product details
    │   │   ├── Cart.js            # Shopping cart
    │   │   ├── Payment.js         # Payment page
    │   │   ├── PaymentSuccess.js  # Payment success page
    │   │   ├── Tracking.js        # Order tracking
    │   │   ├── Login.js           # Login page
    │   │   ├── Signup.js          # Signup page
    │   │   ├── Reviews.js         # Reviews page
    │   │   └── admin/
    │   │       ├── AdminDashboard.js    # Admin dashboard
    │   │       ├── AdminProducts.js     # Product management
    │   │       ├── AdminAddProduct.js   # Add product
    │   │       ├── AdminEditProduct.js  # Edit product
    │   │       └── AdminOrders.js       # Orders management
    │   ├── App.js                 # Main app component
    │   ├── main.jsx               # React entry point (Vite)
    │   └── index.css              # Tailwind CSS
    ├── index.html                 # HTML entry point (Vite)
    ├── vite.config.js             # Vite configuration
    ├── package.json
    ├── tailwind.config.js
    └── postcss.config.js
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` with your MongoDB connection string:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pizza-shop
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

5. Start MongoDB (if using local MongoDB):
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
# or
mongod
```

6. Start the backend server:
```bash
npm start
# or for development with auto-reload
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (optional, defaults are set):
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

**Note:** This project uses Vite instead of Create React App for faster development and builds.

## 🎯 Usage

### Creating an Admin User

To create an admin user, you can either:

1. **Using MongoDB directly:**
   - Sign up normally through the website
   - Connect to MongoDB and update the user document:
   ```javascript
   db.users.updateOne(
     { email: "admin@example.com" },
     { $set: { isAdmin: true } }
   )
   ```

2. **Or modify the signup route temporarily** to set `isAdmin: true` for testing

### Image Upload

- Admin can upload product images directly from their computer
- No need to provide URLs or filenames
- Images are automatically saved to `/backend/uploads` with unique filenames
- Supported formats: JPEG, JPG, PNG, GIF, WEBP
- Maximum file size: 5MB

### Payment Demo

- Use any card details (demo mode)
- OTP for demo: **1234**
- Payment is simulated, no real transactions

### Order Tracking

- After successful payment, save the Order ID
- Use the Order ID to track order status on the Tracking page

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Orders
- `POST /api/orders` - Create order (protected)
- `GET /api/orders` - Get orders (protected, admin sees all)
- `GET /api/orders/:id` - Get order by ID (public for tracking)
- `PUT /api/orders/:id/status` - Update order status (admin only)

### Reviews
- `GET /api/reviews` - Get all reviews
- `POST /api/reviews` - Create review (protected)

## 🎨 Technologies Used

- **Frontend:**
  - React 18
  - React Router DOM
  - Tailwind CSS
  - Axios
  - Socket.io Client
  - React Icons

- **Backend:**
  - Node.js
  - Express.js
  - MongoDB with Mongoose
  - JWT (jsonwebtoken)
  - bcryptjs
  - Multer (file upload)
  - Socket.io
  - CORS

## 📝 Notes

- All sensitive data should be stored in `.env` files
- JWT tokens are stored in localStorage
- Images are served statically from `/uploads` directory
- Socket.io provides real-time order notifications to admin
- The project is ready for production with proper environment variables

## 🐛 Troubleshooting

1. **MongoDB Connection Error:**
   - Ensure MongoDB is running
   - Check the connection string in `.env`
   - Verify MongoDB port (default: 27017)

2. **Image Upload Not Working:**
   - Check that `/backend/uploads` directory exists
   - Verify file size is under 5MB
   - Ensure file format is supported

3. **Socket.io Not Connecting:**
   - Check CORS settings in `server.js`
   - Verify Socket.io URL in frontend `.env`
   - Ensure both frontend and backend are running

4. **JWT Token Issues:**
   - Clear localStorage and login again
   - Check JWT_SECRET in backend `.env`

## 📄 License

This project is open source and available for educational purposes.

