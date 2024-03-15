import React from "react";
import { Link } from "react-router-dom";
import OtherFooter from "../components/OtherFooter";
const LoansPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="p-8 bg-blue-100 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-blue-700">Loans Page</h1>
        <p className="mt-4 text-blue-600">
          Explore your loan options or manage existing loans. Discover flexible
          payment plans and competitive rates to suit your needs.
        </p>
        <Link
          to="/"
          className="inline-block px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors duration-200"
        >
          Home
        </Link>
      </div>
      <OtherFooter />
    </div>
  );
};

export default LoansPage;
