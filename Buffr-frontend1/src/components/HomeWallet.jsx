import React from "react";
import { IoMdAddCircleOutline } from "react-icons/io";
import { Link } from "react-router-dom";

const SimpleAddButton = () => {
  const addWallet = () => {
    console.log("Wallet added!");
  };

  return (
    <div className="py-2 px-2">
      <h1 className="px-4 py-2">Wallets</h1>
      <div
        className="grid grid-cols-3 gap-4 p-2 text-blue-500 border-b border-gray-300"
        style={{ height: "calc(10rem + 2rem)" }}
      >
        <Link
          to={"/addwallet"}
          onClick={addWallet}
          className="border bg-gray-50 p-4 text-center flex flex-col items-center justify-center rounded-2xl h-40"
        >
          <IoMdAddCircleOutline className="inline-block mb-2 text-2xl" />
          Add Wallet
        </Link>
      </div>
    </div>
  );
};

export default SimpleAddButton;
