import React from "react";
import HomeFooterBtn from "./components/HomeFooterBtn";
import HomeTransactionBtn from "./components/HomeTransactionBtn";
import HomeLoanBtn from "./components/HomeLoanBtn";
import { IoQrCodeOutline } from "react-icons/io5";
import { LuSendHorizonal } from "react-icons/lu";

const FooterButtons = () => {
  return (
    <div className="fixed inset-x-0 bottom-0 flex flex-col items-center shadow-lg rounded-2xl">
      <div className="flex justify-around w-full bg-gray-100 py-2 px-2 rounded-3xl">
        <HomeFooterBtn />
        <HomeTransactionBtn />
        <HomeLoanBtn />
      </div>
    </div>
  );
};
export default FooterButtons;
