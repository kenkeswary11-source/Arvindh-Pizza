import React, { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';
import NotificationToast from '../components/NotificationToast';

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
    // Connect to Socket.io
    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    const newSocket = io(SOCKET_URL);

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




