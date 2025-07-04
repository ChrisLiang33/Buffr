import React from "react";
import { Link } from "react-router-dom";
import OtherFooter from "../components/OtherFooter";

const TransactionPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50">
      <div className="max-w-2xl w-full p-8 bg-white rounded-lg shadow-xl border border-purple-200">
        <h1 className="text-3xl font-bold text-purple-700 mb-4">
          Transactions
        </h1>
        <p className="text-purple-600">
          View and manage your recent transactions. Filter by date, type, or
          amount to get the insights you need.
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

export default TransactionPage;
