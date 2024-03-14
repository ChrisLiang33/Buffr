import React from "react";
import BackBtn from "./components/BackBtn";
import SearchBar from "./components/SearchBar";
import BuffrIcon from "./components/BuffrIcon";
import icon from "./assets/icon.svg";
import { Link } from "react-router-dom";

const SendingPage = () => {
  return (
    <>
      <br />
      <div className="flex flex-col min-h-screen">
        <div className="flex-1">
          <div className="flex gap-5 justify-between px-4 py-2 bg-white max-w-[393px]">
            <BackBtn />
            <div className="my-auto text-lg font-medium leading-7 text-center text-slate-950">
              Contact
            </div>
            <div className="flex justify-center items-center px-4 w-14 h-14 bg-white aspect-square rounded-full">
              like
            </div>
          </div>
          <div className="flex flex-row">
            <img src={icon} alt="Buffr logo" />
            <div className="pt-3">
              <h1>elias matheus</h1>
              <h1>264 61 234 5678</h1>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SendingPage;
