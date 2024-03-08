import React from "react";
import { CiSettings } from "react-icons/ci";

const SettingBtn = () => {
  const handleSettingsClick = () => {
    console.log("Settings icon clicked");
  };
  return (
    <CiSettings
      onClick={handleSettingsClick}
      className="cursor-pointer"
      size={25}
    />
  );
};

export default SettingBtn;
