import React, { useState } from "react";

const SliderButton = () => {
  const [position, setPosition] = useState(0); // Slider starts at the first position (0)

  const handleLeftClick = () => {
    setPosition((prevPosition) => Math.max(prevPosition - 1, 0)); // Decrease position, minimum is 0
  };

  const handleRightClick = () => {
    setPosition((prevPosition) => Math.min(prevPosition + 1, 2)); // Increase position, maximum is 2 (for three positions)
  };

  // Generate dots based on the current position
  const leftDots = [...Array(position).keys()].map((dot) => (
    <span key={dot} className="h-2 w-2 bg-gray-500 rounded-full" />
  ));
  const rightDots = [...Array(2 - position).keys()].map((dot) => (
    <span key={dot} className="h-2 w-2 bg-gray-500 rounded-full" />
  ));

  return (
    <div className="flex items-center justify-center space-x-4">
      <div
        onClick={handleLeftClick}
        className={`flex space-x-1 ${position === 0 ? "opacity-0" : ""}`}
      >
        {leftDots}
      </div>
      <span className="text-lg">{`Position: ${position + 1}`}</span>
      <div
        onClick={handleRightClick}
        className={`flex space-x-1 ${position === 2 ? "opacity-0" : ""}`}
      >
        {rightDots}
      </div>
    </div>
  );
};

export default SliderButton;
