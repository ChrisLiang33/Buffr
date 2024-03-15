import React from "react";
import vector from "../assets/vector.svg";

const VectorStripe = () => {
  return (
    <div className="relative">
      {" "}
      <img
        src={vector}
        alt=""
        className="absolute z-negative top-0 left-0"
      />{" "}
    </div>
  );
};

export default VectorStripe;
