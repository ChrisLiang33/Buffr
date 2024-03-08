import React from "react";
import { CiSettings } from "react-icons/ci";
import { Link } from "react-router-dom";

const SettingBtn = () => {
  const handleSettingsClick = () => {
    console.log("Settings icon clicked");
  };
  return (
    <Link to={"/settings"}>
      <CiSettings
        onClick={handleSettingsClick}
        className="cursor-pointer"
        size={25}
      />
    </Link>
  );
};

export default SettingBtn;
