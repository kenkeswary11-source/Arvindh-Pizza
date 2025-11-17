# Pickup Order Notification Feature - Setup Guide

## 📋 Overview

This feature sends real-time notifications to customers when their order status is changed to "Ready for Pickup" by the admin.

## 🔧 Required Changes

### 1. Database Schema Change (REQUIRED)

**File:** `backend/models/Order.js`

**Change Required:**
```javascript
// Line 33 - Update the enum array
orderStatus: {
  type: String,
  enum: ['Pending', 'Preparing', 'Ready for Pickup', 'Out for Delivery', 'Delivered'],
  default: 'Pending',
},
```

**Why:** Adds "Ready for Pickup" as a valid order status.

---

### 2. Install Dependencies (Optional - for Email/SMS)

If you want to enable email notifications, install nodemailer:

```bash
cd backend
npm install nodemailer
```

For SMS notifications (Twilio), install:

```bash
npm install twilio
```

---

## 📁 New Files Created

### Backend Files:
1. `backend/utils/notificationService.js` - Notification service (WebSocket, Email, SMS)

### Frontend Files:
1. `frontend/src/components/NotificationToast.jsx` - Toast notification component
2. `frontend/src/context/NotificationContext.jsx` - Notification context provider

---

## 🔄 Modified Files (Minimal Changes)

### Backend:
1. **`backend/routes/orderRoutes.js`**
   - Added import for `sendPickupReadyNotification`
   - Added "Ready for Pickup" to valid statuses
   - Added notification trigger when status changes to "Ready for Pickup"

2. **`backend/server.js`**
   - Added Socket.io handlers for user-specific rooms

### Frontend:
1. **`frontend/src/App.jsx`**
   - Wrapped app with `NotificationProvider`
   - Added `AppContent` component to access auth context

2. **`frontend/src/index.css`**
   - Added `slideInRight` animation for notifications

3. **`frontend/src/pages/admin/AdminOrders.jsx`**
   - Added "Ready for Pickup" option to status dropdown
   - Added icon for "Ready for Pickup" status

4. **`frontend/src/pages/LiveTracking.jsx`**
   - Added "Ready for Pickup" status handling
   - Updated status steps for pickup orders

---

## ⚙️ Configuration

### Environment Variables (Optional)

Add to `backend/.env` for email notifications:

```env
# Email Configuration (Optional)
ENABLE_EMAIL_NOTIFICATIONS=true
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FRONTEND_URL=http://localhost:3001
```

For SMS notifications (Twilio):

```env
# SMS Configuration (Optional)
ENABLE_SMS_NOTIFICATIONS=true
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890
```

**Note:** WebSocket notifications work without any configuration. Email and SMS are optional.

---

## 🚀 Integration Steps

### Step 1: Update Database Schema

1. Open `backend/models/Order.js`
2. Update line 33 to include "Ready for Pickup":
   ```javascript
   enum: ['Pending', 'Preparing', 'Ready for Pickup', 'Out for Delivery', 'Delivered'],
   ```
3. Save the file

### Step 2: Install Dependencies (Optional)

Only if you want email/SMS notifications:

```bash
cd backend
npm install nodemailer  # For email
# OR
npm install twilio      # For SMS
```

### Step 3: Restart Backend Server

```bash
cd backend
npm start
```

### Step 4: Restart Frontend (if running)

```bash
cd frontend
npm run dev
```

---

## 🎯 How It Works

### Flow:

1. **Admin Updates Order Status:**
   - Admin goes to `/admin/orders`
   - Selects "Ready for Pickup" from dropdown
   - Status is updated in database

2. **Backend Triggers Notification:**
   - `orderRoutes.js` detects status change to "Ready for Pickup"
   - Calls `sendPickupReadyNotification()`
   - Sends via WebSocket (always)
   - Optionally sends email/SMS (if configured)

3. **Customer Receives Notification:**
   - **WebSocket:** Real-time toast notification appears
   - **Email:** Email sent to customer's email address
   - **SMS:** SMS sent to customer's phone (if configured)

### Notification Channels:

#### 1. WebSocket (Always Active)
- Real-time in-app notification
- Appears as toast in top-right corner
- Auto-dismisses after 10 seconds
- Clickable link to view order

#### 2. Email (Optional)
- Requires email configuration in `.env`
- Sends HTML email with order details
- Includes pickup location and order link

#### 3. SMS (Optional)
- Requires Twilio configuration
- Sends text message with order details
- Note: Requires phone number in user/order model

---

## 🧪 Testing

### Test WebSocket Notification:

1. **As Customer:**
   - Place an order
   - Stay on the website (or open tracking page)

2. **As Admin:**
   - Go to `/admin/orders`
   - Change order status to "Ready for Pickup"

3. **Expected Result:**
   - Customer sees toast notification immediately
   - Notification shows order number and total
   - Clicking "View Order" opens tracking page

### Test Email Notification:

1. Configure email in `backend/.env`
2. Place an order with a valid email
3. Admin changes status to "Ready for Pickup"
4. Check customer's email inbox

---

## 📱 Notification Features

### Toast Notification Includes:
- ✅ Order number
- ✅ Total amount
- ✅ "View Order" button
- ✅ Auto-dismiss after 10 seconds
- ✅ Manual close button
- ✅ Smooth animations

### Email Notification Includes:
- ✅ Professional HTML template
- ✅ Order details
- ✅ Pickup location
- ✅ Link to track order
- ✅ Restaurant contact info

---

## 🔒 Security

- Notifications only sent when admin changes status
- WebSocket rooms are order/user specific
- Email/SMS only sent to order's customer email
- All admin actions require authentication

---

## 🐛 Troubleshooting

### Notification Not Appearing?

1. **Check Socket.io Connection:**
   - Open browser console
   - Look for Socket.io connection errors
   - Verify `VITE_SOCKET_URL` in frontend `.env`

2. **Check Backend Logs:**
   - Look for "Sending pickup ready notification" message
   - Check for any errors in notification service

3. **Verify Status Change:**
   - Ensure admin actually changed status to "Ready for Pickup"
   - Check database to confirm status was saved

### Email Not Sending?

1. **Check Configuration:**
   - Verify `ENABLE_EMAIL_NOTIFICATIONS=true` in `.env`
   - Check email credentials are correct
   - For Gmail, use App Password (not regular password)

2. **Check Backend Logs:**
   - Look for email service errors
   - Check nodemailer connection issues

### SMS Not Sending?

1. **Check Configuration:**
   - Verify Twilio credentials in `.env`
   - Ensure phone number format is correct (+1234567890)
   - Check if phone number is stored in order/user model

---

## 📝 Notes

- **WebSocket notifications work immediately** - no configuration needed
- **Email/SMS are optional** - system works without them
- **Notifications are non-blocking** - if email/SMS fails, order still updates
- **Multiple notifications** - customer can receive all three types simultaneously

---

## ✨ Future Enhancements

1. **Browser Push Notifications:** Use Web Push API
2. **Notification History:** Store notifications in database
3. **Notification Preferences:** Let users choose notification types
4. **Scheduled Reminders:** Send reminder if order not picked up after X minutes

---

**Feature is ready to use after database schema update!** 🎉





