import React from "react";
import HomeFooterBtn from "./Btns/HomeFooterBtn";
import HomeTransactionBtn from "./Btns/HomeTransactionBtn";
import HomeLoanBtn from "./Btns/HomeLoanBtn";

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
