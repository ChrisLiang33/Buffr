import React from "react";
import { FaMoneyBillWave } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const HomeLoanBtn = () => {
  const navigate = useNavigate();
  return (
    <Link
      to={"/loans"}
      className="flex flex-col items-center justify-center font-bold py-2 px-4 rounded hover:bg-gray-200 transition duration-200 ease-in-out"
    >
      <FaMoneyBillWave className="mb-2 text-lg" />
      Loans
    </Link>
  );
};

export default HomeLoanBtn;
