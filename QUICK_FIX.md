# Quick Fix for 500 Error

## Issue
Getting 500 error when updating order status to "Ready for Pickup"

## Solution

### Step 1: Restart Backend Server

The database schema has been updated, but the server needs to be restarted to load the changes.

**Stop the current server:**
- Press `Ctrl+C` in the terminal where the server is running

**Restart the server:**
```bash
cd backend
npm start
```

### Step 2: Verify Server is Running

You should see:
```
Server running on port 5000
```

### Step 3: Test Order Status Update

1. Go to `/admin/orders`
2. Try changing an order status to "Ready for Pickup"
3. It should work now!

## What Was Fixed

1. ✅ Added "Ready for Pickup" to Order model enum
2. ✅ Fixed ObjectId conversion for Socket.io
3. ✅ Made notification service handle errors gracefully
4. ✅ Made nodemailer optional (no installation needed)

## If Still Getting Errors

Check the backend console for the actual error message. Common issues:

1. **MongoDB connection error** - Check if MongoDB is running
2. **Schema validation error** - Make sure server was restarted after schema change
3. **Socket.io error** - Check CORS configuration

---

**The server MUST be restarted for the schema change to take effect!**




