import React from "react";
import BuffrIcon from "./components/rows3/BuffrIcon";
import vector from "./assets/vector.svg";

import HomeGrid from "./components/HomeGrid";
import HomeWallet from "./components/HomeWallet";
import BankDetails from "./components/BankDetails";
import HomeNavbar from "./components/HomeNavbar";
import HomeFooter from "./HomeFooter";

const HomePage = () => {
  return (
    <div>
      <HomeNavbar />
      <BuffrIcon />
      <BankDetails />
      <div className="relative">
        {" "}
        <img
          src={vector}
          alt=""
          className="absolute z-negative top-0 left-0"
        />{" "}
      </div>
      <HomeWallet />
      <HomeGrid />
      <HomeFooter />
    </div>
  );
};

export default HomePage;
