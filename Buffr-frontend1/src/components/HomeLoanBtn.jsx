import React from "react";
import { IoCashOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

const HomeLoanBtn = () => {
  return (
    <Link
      to={"/loans"}
      className="flex flex-col items-center justify-center font-bold py-2 px-4 rounded hover:bg-gray-200 transition duration-200 ease-in-out"
    >
      <IoCashOutline className="mb-2 text-2xl" />
      Loans
    </Link>
  );
};

export default HomeLoanBtn;
