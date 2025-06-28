import React from "react";
import {
  IoClose,
  IoRefresh,
  IoWarning,
  IoInformationCircle,
} from "react-icons/io5";

const ErrorMessage = ({
  message,
  type = "error",
  onRetry,
  onClose,
  showClose = true,
  className = "",
}) => {
  const typeConfig = {
    error: {
      icon: IoWarning,
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      textColor: "text-red-800",
      iconColor: "text-red-500",
    },
    warning: {
      icon: IoWarning,
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      textColor: "text-yellow-800",
      iconColor: "text-yellow-500",
    },
    info: {
      icon: IoInformationCircle,
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-800",
      iconColor: "text-blue-500",
    },
    success: {
      icon: IoInformationCircle,
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-800",
      iconColor: "text-green-500",
    },
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={`p-4 border rounded-lg ${config.bgColor} ${config.borderColor} ${className}`}
    >
      <div className="flex items-start">
        <Icon className={`mt-0.5 mr-3 ${config.iconColor} flex-shrink-0`} />
        <div className="flex-1">
          <p className={`text-sm ${config.textColor}`}>{message}</p>
        </div>
        <div className="flex items-center space-x-2">
          {onRetry && (
            <button
              onClick={onRetry}
              className={`p-1 rounded hover:bg-opacity-20 ${config.bgColor} ${config.textColor}`}
              title="Retry"
            >
              <IoRefresh className="w-4 h-4" />
            </button>
          )}
          {showClose && onClose && (
            <button
              onClick={onClose}
              className={`p-1 rounded hover:bg-opacity-20 ${config.bgColor} ${config.textColor}`}
              title="Close"
            >
              <IoClose className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
