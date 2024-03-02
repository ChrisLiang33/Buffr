import React from "react";
import { HiOutlineRectangleStack } from "react-icons/hi2";
import { Link } from "react-router-dom";

const HomeTransactionBtn = () => {
  return (
    <Link
      to={"/transactions"}
      className="flex flex-col items-center justify-center font-bold py-2 px-4 rounded hover:bg-gray-200 transition duration-200 ease-in-out"
    >
      <HiOutlineRectangleStack className="mb-2" /> Transactions
    </Link>
  );
};

export default HomeTransactionBtn;
