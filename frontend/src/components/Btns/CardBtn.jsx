import React from "react";
import card from "../../assets/card.svg";

const CardBtn = () => {
  return (
    <div
      className="flex items-center justify-between w-72 p-2 rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
      style={{ borderRadius: "12px" }}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-3">
          <img src={card} alt="Card" className="w-12 h-12" />
          <div className="flex flex-col">
            <span className="font-semibold text-gray-700">Buffr Card</span>
            <span className="text-sm text-gray-600">..018</span>
          </div>
        </div>
        <div>
          <span className="text-gray-500 hover:text-blue-600 cursor-pointer">
            View &gt;
          </span>
        </div>
      </div>
    </div>
  );
};

export default CardBtn;
