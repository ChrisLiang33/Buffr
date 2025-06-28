import React, { useState, useEffect } from "react";
import { IoCheckmarkCircle, IoClose } from "react-icons/io5";

const SuccessMessage = ({
  message,
  onClose,
  autoClose = true,
  duration = 5000,
  className = "",
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoClose && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) return null;

  return (
    <div
      className={`p-4 bg-green-50 border border-green-200 rounded-lg ${className}`}
    >
      <div className="flex items-start">
        <IoCheckmarkCircle className="mt-0.5 mr-3 text-green-500 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm text-green-800">{message}</p>
        </div>
        <button
          onClick={handleClose}
          className="p-1 rounded hover:bg-green-100 text-green-800"
          title="Close"
        >
          <IoClose className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default SuccessMessage;
