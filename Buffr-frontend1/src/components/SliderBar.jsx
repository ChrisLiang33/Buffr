import React, { useState } from "react";
import buffr from "../assets/buffr.svg"; // Import the Buffr logo

const SliderBar = () => {
  const [position, setPosition] = useState(0); // Slider starts at the first position (0)

  const handleLeftClick = () => {
    setPosition((prevPosition) => Math.max(prevPosition - 1, 0)); // Decrease position, minimum is 0
  };

  const handleRightClick = () => {
    setPosition((prevPosition) => Math.min(prevPosition + 1, 2)); // Increase position, maximum is 2 (for three positions)
  };

  const handleBuffrClick = () => {};

  // Generate dots based on the current position
  const leftDots = [...Array(position).keys()].map((dot) => (
    <span key={dot} className="h-2 w-2 bg-gray-200 rounded-full" />
  ));
  const rightDots = [...Array(2 - position).keys()].map((dot) => (
    <span key={dot} className="h-2 w-2 bg-gray-200 rounded-full" />
  ));

  return (
    <div className="flex items-center justify-center space-x-4">
      <div
        onClick={handleLeftClick}
        className={`flex space-x-1 ${position === 0 ? "opacity-0" : ""}`}
      >
        {leftDots}
      </div>
      <button
        onClick={handleBuffrClick}
        className="inline-flex items-center px-4 py-2 gap-3 rounded-full transition-colors"
        style={{
          backgroundColor: "var(--surface-gray-0, #F8FAFC)", // Use your CSS variable or fallback to a specific color
          borderRadius: "var(--Radius-Radius-Full, 999px)", // Use your CSS variable or fallback to a high value for full rounding
        }}
      >
        <img src={buffr} alt="Buffr" className="w-5 h-5" />{" "}
        {/* Adjust the size as needed */}
        <span className="text-xs">Buffr</span>
      </button>

      <div
        onClick={handleRightClick}
        className={`flex space-x-1 ${position === 2 ? "opacity-0" : ""}`}
      >
        {rightDots}
      </div>
    </div>
  );
};

export default SliderBar;
