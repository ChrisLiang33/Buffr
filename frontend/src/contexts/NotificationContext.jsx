import React, { createContext, useContext, useState, useCallback } from "react";
import ErrorMessage from "../components/ui/ErrorMessage";
import SuccessMessage from "../components/ui/SuccessMessage";

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    const newNotification = { ...notification, id };
    setNotifications((prev) => [...prev, newNotification]);

    // Auto-remove success messages after 5 seconds
    if (notification.type === "success" && notification.autoClose !== false) {
      setTimeout(() => {
        removeNotification(id);
      }, 5000);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  }, []);

  const showError = useCallback(
    (message, options = {}) => {
      return addNotification({
        type: "error",
        message,
        ...options,
      });
    },
    [addNotification]
  );

  const showSuccess = useCallback(
    (message, options = {}) => {
      return addNotification({
        type: "success",
        message,
        ...options,
      });
    },
    [addNotification]
  );

  const showWarning = useCallback(
    (message, options = {}) => {
      return addNotification({
        type: "warning",
        message,
        ...options,
      });
    },
    [addNotification]
  );

  const showInfo = useCallback(
    (message, options = {}) => {
      return addNotification({
        type: "info",
        message,
        ...options,
      });
    },
    [addNotification]
  );

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const renderNotification = (notification) => {
    switch (notification.type) {
      case "error":
        return (
          <ErrorMessage
            key={notification.id}
            message={notification.message}
            type="error"
            onClose={() => removeNotification(notification.id)}
            onRetry={notification.onRetry}
            className="mb-2"
          />
        );
      case "success":
        return (
          <SuccessMessage
            key={notification.id}
            message={notification.message}
            onClose={() => removeNotification(notification.id)}
            autoClose={notification.autoClose}
            duration={notification.duration}
            className="mb-2"
          />
        );
      case "warning":
        return (
          <ErrorMessage
            key={notification.id}
            message={notification.message}
            type="warning"
            onClose={() => removeNotification(notification.id)}
            onRetry={notification.onRetry}
            className="mb-2"
          />
        );
      case "info":
        return (
          <ErrorMessage
            key={notification.id}
            message={notification.message}
            type="info"
            onClose={() => removeNotification(notification.id)}
            onRetry={notification.onRetry}
            className="mb-2"
          />
        );
      default:
        return null;
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        showError,
        showSuccess,
        showWarning,
        showInfo,
        clearAll,
      }}
    >
      {children}
      {/* Notification Container */}
      {notifications.length > 0 && (
        <div className="fixed top-4 right-4 z-50 max-w-sm w-full space-y-2">
          {notifications.map(renderNotification)}
        </div>
      )}
    </NotificationContext.Provider>
  );
};
