import React from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { useOffline } from "../hooks/useOffline";
import ResponsiveContainer from "../components/layout/ResponsiveContainer";
import HomeNavbar from "../components/HomeNavbar";
import HomeWallet from "../components/HomeWallet";
import HomeGrid from "../components/HomeGrid";
import HomeFooter from "../components/HomeFooter";
import OfflineIndicator from "../components/ui/OfflineIndicator";
import ErrorMessage from "../components/ui/ErrorMessage";

const HomePage = () => {
  const { user, userData } = useAuthContext();
  const { isOffline } = useOffline();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <ErrorMessage
          message="Please log in to access your account"
          type="error"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50">
      <OfflineIndicator />

      <ResponsiveContainer className="py-4">
        <HomeNavbar />
      </ResponsiveContainer>

      <ResponsiveContainer className="py-4">
        <HomeWallet />
      </ResponsiveContainer>

      <HomeGrid />

      <ResponsiveContainer className="py-4">
        <HomeFooter />
      </ResponsiveContainer>
    </div>
  );
};

export default HomePage;
