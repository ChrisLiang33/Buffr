import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useNotification } from "../contexts/NotificationContext";
import { useOffline } from "../hooks/useOffline";
import ResponsiveContainer from "./layout/ResponsiveContainer";
import {
  IoPhonePortraitOutline,
  IoTicketOutline,
  IoDocumentTextOutline,
  IoStarOutline,
  IoShieldCheckmarkOutline,
  IoFlashOutline,
  IoClose,
} from "react-icons/io5";

const HomeGrid = () => {
  const navigate = useNavigate();
  const { showInfo, showError } = useNotification();
  const { isOffline } = useOffline();
  const [showMobileRecharge, setShowMobileRecharge] = useState(false);
  const [rechargeData, setRechargeData] = useState({
    phoneNumber: "",
    amount: "",
    operator: "mtn",
  });

  const handleServiceClick = (service) => {
    if (isOffline) {
      showError(
        "You are offline. Please check your connection to use this service."
      );
      return;
    }

    switch (service) {
      case "mobile-recharge":
        setShowMobileRecharge(true);
        break;
      case "tickets":
        showInfo("Ticket booking service coming soon!");
        break;
      case "subscriptions":
        navigate("/subscriptions");
        break;
      case "insurance":
        showInfo("Insurance services coming soon!");
        break;
      case "utilities":
        showInfo("Utility bill payments coming soon!");
        break;
      default:
        showInfo("This service is under development.");
    }
  };

  const handleMobileRecharge = async (e) => {
    e.preventDefault();

    if (!rechargeData.phoneNumber || !rechargeData.amount) {
      showError("Please fill in all fields");
      return;
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      showInfo(
        `Mobile recharge of $${rechargeData.amount} to ${rechargeData.phoneNumber} successful!`
      );
      setShowMobileRecharge(false);
      setRechargeData({ phoneNumber: "", amount: "", operator: "mtn" });
    } catch (error) {
      showError("Recharge failed. Please try again.");
    }
  };

  const gridItems = [
    {
      id: "mobile-recharge",
      icon: IoPhonePortraitOutline,
      title: "Mobile Recharge",
      description: "Recharge your mobile balance",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      hoverColor: "hover:bg-blue-100",
    },
    {
      id: "tickets",
      icon: IoTicketOutline,
      title: "Buy Tickets",
      description: "Movie, event & travel tickets",
      color: "text-green-500",
      bgColor: "bg-green-50",
      hoverColor: "hover:bg-green-100",
    },
    {
      id: "subscriptions",
      icon: IoDocumentTextOutline,
      title: "Your Subscriptions",
      description: "Manage your subscriptions",
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      hoverColor: "hover:bg-purple-100",
    },
    {
      id: "sponsored",
      icon: IoStarOutline,
      title: "Sponsored Offers",
      description: "Exclusive deals for you",
      color: "text-yellow-500",
      bgColor: "bg-yellow-50",
      hoverColor: "hover:bg-yellow-100",
    },
    {
      id: "insurance",
      icon: IoShieldCheckmarkOutline,
      title: "All Insurance",
      description: "Health, car & life insurance",
      color: "text-red-500",
      bgColor: "bg-red-50",
      hoverColor: "hover:bg-red-100",
    },
    {
      id: "utilities",
      icon: IoFlashOutline,
      title: "Explore Utilities",
      description: "Pay electricity, water & gas",
      color: "text-indigo-500",
      bgColor: "bg-indigo-50",
      hoverColor: "hover:bg-indigo-100",
    },
  ];

  return (
    <>
      <ResponsiveContainer className="py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
          {gridItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleServiceClick(item.id)}
                className={`border ${item.bgColor} p-3 sm:p-4 text-center flex flex-col items-center justify-center rounded-xl sm:rounded-2xl transition-all duration-200 ${item.hoverColor} hover:shadow-md hover:scale-105 min-h-[100px] sm:min-h-[120px] lg:min-h-[140px]`}
              >
                <Icon className={`text-2xl sm:text-3xl mb-2 ${item.color}`} />
                <span className="text-xs sm:text-sm font-medium text-gray-700 leading-tight">
                  {item.title}
                </span>
                <span className="text-xs text-gray-500 mt-1 leading-tight hidden sm:block">
                  {item.description}
                </span>
              </button>
            );
          })}
        </div>
      </ResponsiveContainer>

      {/* Mobile Recharge Modal */}
      {showMobileRecharge && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Mobile Recharge
                </h2>
                <button
                  onClick={() => setShowMobileRecharge(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <IoClose className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              <form onSubmit={handleMobileRecharge} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={rechargeData.phoneNumber}
                    onChange={(e) =>
                      setRechargeData({
                        ...rechargeData,
                        phoneNumber: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter mobile number"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Operator
                  </label>
                  <select
                    value={rechargeData.operator}
                    onChange={(e) =>
                      setRechargeData({
                        ...rechargeData,
                        operator: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="mtn">MTN</option>
                    <option value="vodacom">Vodacom</option>
                    <option value="cell-c">Cell C</option>
                    <option value="telkom">Telkom</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount
                  </label>
                  <select
                    value={rechargeData.amount}
                    onChange={(e) =>
                      setRechargeData({
                        ...rechargeData,
                        amount: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select amount</option>
                    <option value="10">$10</option>
                    <option value="20">$20</option>
                    <option value="50">$50</option>
                    <option value="100">$100</option>
                    <option value="200">$200</option>
                    <option value="500">$500</option>
                  </select>
                </div>

                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowMobileRecharge(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Recharge
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HomeGrid;
