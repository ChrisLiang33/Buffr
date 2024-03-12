import React from "react";
import HomeFooterBtn from "./components/HomeFooterBtn";
import HomeTransactionBtn from "./components/HomeTransactionBtn";
import HomeLoanBtn from "./components/HomeLoanBtn";
import { IoQrCodeOutline } from "react-icons/io5";
import { LuSendHorizonal } from "react-icons/lu";
import { Link } from "react-router-dom";

const FooterButtons = () => {
  return (
    <div className="sticky inset-x-0 bottom-0 flex flex-col items-center shadow-lg rounded-2xl">
      <div className="flex justify-center w-full mb-4 gap-4">
        <Link
          to={"/send"}
          className="flex items-center bg-blue-500 text-white px-8 py-4 rounded shadow hover:bg-blue-600 transition duration-300 rounded-3xl"
        >
          <LuSendHorizonal className="text-2xl" />
        </Link>
        <Link
          to={"qrcode"}
          className="flex items-center bg-black text-white px-8 py-4 rounded shadow hover:bg-blue-600 transition duration-300 rounded-3xl"
        >
          <IoQrCodeOutline className="text-2xl" />
        </Link>
      </div>
      <div className="flex justify-around w-full bg-gray-100 py-2 px-2 rounded-3xl">
        <HomeFooterBtn />
        <HomeTransactionBtn />
        <HomeLoanBtn />
      </div>
    </div>
  );
};
export default FooterButtons;
