import React, { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';
import NotificationToast from '../components/NotificationToast';
import { SOCKET_URL } from '../config/api';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children, userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Only connect if SOCKET_URL is available
    if (!SOCKET_URL) {
      console.warn('Socket.io connection skipped: VITE_SOCKET_URL not configured');
      return;
    }

    // Connect to Socket.io
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      console.log('Socket.io connected');
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket.io connection error:', error);
    });

    // Join user-specific room if userId is available
    if (userId) {
      newSocket.emit('joinUserRoom', userId);
    }

    // Listen for pickup ready notifications
    newSocket.on('pickupReady', (data) => {
      console.log('Pickup ready notification received:', data);
      setNotifications((prev) => [...prev, { ...data, id: Date.now() }]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [userId]);

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ notifications, removeNotification }}>
      {children}
      {/* Render notification toasts */}
      <div className="fixed top-20 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <NotificationToast
            key={notification.id}
            notification={notification}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};




