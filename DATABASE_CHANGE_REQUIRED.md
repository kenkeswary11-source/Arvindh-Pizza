# Database Schema Change Required

## Order Model - Add "Ready for Pickup" Status

### Current Status Enum:
```javascript
enum: ['Pending', 'Preparing', 'Out for Delivery', 'Delivered']
```

### New Status Enum (After Change):
```javascript
enum: ['Pending', 'Preparing', 'Ready for Pickup', 'Out for Delivery', 'Delivered']
```

### File to Modify:
`backend/models/Order.js` - Line 33

### Change Required:
```javascript
// BEFORE:
orderStatus: {
  type: String,
  enum: ['Pending', 'Preparing', 'Out for Delivery', 'Delivered'],
  default: 'Pending',
},

// AFTER:
orderStatus: {
  type: String,
  enum: ['Pending', 'Preparing', 'Ready for Pickup', 'Out for Delivery', 'Delivered'],
  default: 'Pending',
},
```

### Impact:
- This adds a new valid order status
- Existing orders are not affected (they keep their current status)
- This is a safe, additive change

**Please approve this change before proceeding with the notification feature implementation.**





