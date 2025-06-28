import React from "react";
import { useOffline } from "../../hooks/useOffline";
import { IoWifi, IoWifiOutline } from "react-icons/io5";

const OfflineIndicator = () => {
  const { isOffline, isOnline } = useOffline();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
        <IoWifiOutline className="w-5 h-5" />
        <span className="text-sm font-medium">You're offline</span>
      </div>
    </div>
  );
};

export default OfflineIndicator;
