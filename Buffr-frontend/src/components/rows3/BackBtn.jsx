import React from "react";
import { useNavigate } from "react-router-dom";

function BackBtn() {
  const navigate = useNavigate();

  return (
    <div
      className="flex justify-center items-center px-4 h-14 bg-slate-50 rounded-full cursor-pointer"
      onClick={() => navigate("/")}
    >
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/57b1b7d77750c9f3433af30d213608bd6a7f35b85da9fbc7a13d57bbc2d7e56d"
        className="w-full aspect-square"
        alt="Back"
      />
    </div>
  );
}

export default BackBtn;
