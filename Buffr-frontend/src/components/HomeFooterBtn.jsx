import React from "react";
import { GoHome } from "react-icons/go";
import { Link } from "react-router-dom";

const HomeFooterBtn = () => {
  return (
    <Link
      to={"/"}
      className="flex flex-col items-center justify-center font-bold py-2 px-4 rounded hover:bg-gray-200 transition duration-200 ease-in-out"
    >
      <GoHome className="mb-2" /> Home
    </Link>
  );
};

export default HomeFooterBtn;
