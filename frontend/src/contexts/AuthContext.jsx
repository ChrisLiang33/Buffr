import React, { createContext, useContext, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

const AuthContext = createContext();

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const auth = useAuth();

  // Set up session timeout warning
  useEffect(() => {
    if (!auth.user) return;

    const checkSession = () => {
      const timeUntilExpiry = auth.getTimeUntilExpiry();
      const warningThreshold = 5 * 60 * 1000; // 5 minutes

      if (timeUntilExpiry <= warningThreshold && timeUntilExpiry > 0) {
        const minutes = Math.ceil(timeUntilExpiry / (60 * 1000));
        const shouldExtend = window.confirm(
          `Your session will expire in ${minutes} minute(s). Would you like to extend your session?`
        );

        if (shouldExtend) {
          // Reset session by triggering any user activity
          auth.clearError();
        }
      }
    };

    const sessionCheckInterval = setInterval(checkSession, 60000); // Check every minute

    return () => clearInterval(sessionCheckInterval);
  }, [auth.user, auth.getTimeUntilExpiry, auth.clearError]);

  // Set up beforeunload event to warn about unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (auth.user) {
        e.preventDefault();
        e.returnValue =
          "You have unsaved changes. Are you sure you want to leave?";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [auth.user]);

  const value = {
    ...auth,
    // Add additional security context methods here if needed
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
