import React, { useState } from "react";
import { Link } from "react-router-dom";
import BuffrIcon from "./components/rows3/BuffrIcon";
import SearchBar from "./components/SearchBar";
import NotificationBtn from "./components/NotificationBtn";
import SettingBtn from "./components/SettingBtn";

const HomePage = () => {
  return (
    <div>
      <div className="flex items-center justify-between p-4">
        <SearchBar />
        <div className="flex items-center space-x-4">
          <NotificationBtn />
          <SettingBtn />
        </div>
      </div>
      <BuffrIcon />

      <div className="flex justify-center items-center min-h-screen">
        {" "}
        <Link
          to="/account"
          className="inline-block px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors duration-200"
        >
          Account
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
