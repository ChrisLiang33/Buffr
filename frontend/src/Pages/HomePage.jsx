import React from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { useOffline } from "../hooks/useOffline";
import BuffrIcon from "../components/BuffrIcon";
import VectorStripe from "../components/VectorStripe";
import HomeGrid from "../components/HomeGrid";
import HomeWallet from "../components/HomeWallet";
import BankDetails from "../components/BankDetails";
import HomeNavbar from "../components/HomeNavbar";
import HomeFooter from "../components/HomeFooter";
import OfflineIndicator from "../components/ui/OfflineIndicator";
import ErrorMessage from "../components/ui/ErrorMessage";

const HomePage = () => {
  const { user, userData, error } = useAuthContext();
  const { isOffline } = useOffline();

  return (
    <div>
      <HomeNavbar />

      {error && (
        <div className="px-4 py-2">
          <ErrorMessage message={error} type="error" className="mb-4" />
        </div>
      )}

      {isOffline && (
        <div className="px-4 py-2">
          <ErrorMessage
            message="You are currently offline. Some features may be limited."
            type="warning"
            className="mb-4"
          />
        </div>
      )}

      <BankDetails />
      <VectorStripe />
      <HomeWallet />
      <HomeGrid />
      <HomeFooter />
      <OfflineIndicator />
    </div>
  );
};

export default HomePage;
