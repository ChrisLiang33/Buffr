import React from "react";
import BuffrIcon from "../components/BuffrIcon";
import VectorStripe from "../components/VectorStripe";
import HomeGrid from "../components/HomeGrid";
import HomeWallet from "../components/HomeWallet";
import BankDetails from "../components/BankDetails";
import HomeNavbar from "../components/HomeNavbar";
import HomeFooter from "../components/HomeFooter";

const HomePage = () => {
  return (
    <div>
      <HomeNavbar />
      <BankDetails />
      <VectorStripe />
      <HomeWallet />
      <HomeGrid />
      <HomeFooter />
    </div>
  );
};

export default HomePage;
