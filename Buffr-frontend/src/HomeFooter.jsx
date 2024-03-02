import React from "react";
import HomeFooterBtn from "./components/HomeFooterBtn";
import HomeTransactionBtn from "./components/HomeTransactionBtn";
import HomeLoadBtn from "./components/HomeLoanBtn";

const FooterButtons = () => {
  return (
    <div className="fixed inset-x-0 bottom-0  p-4 flex justify-evenly items-center shadow-lg">
      <HomeFooterBtn />
      <HomeTransactionBtn />
      <HomeLoadBtn />
    </div>
  );
};

export default FooterButtons;
