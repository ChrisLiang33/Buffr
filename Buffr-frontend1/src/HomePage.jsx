import React from "react";
import BuffrIcon from "./components/rows3/BuffrIcon";

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
      <HomeWallet />
      <HomeGrid />
      <HomeFooter />
    </div>
  );
};

export default HomePage;
