import React from "react";
import BackBtn from "../components/Btns/BackBtn";
import SearchBar from "../components/SearchBar";
import icon from "../assets/icon.svg";
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
              Send to
            </div>
            <div className="flex justify-center items-center px-4 w-14 h-14 bg-white aspect-square rounded-full">
              Group
            </div>
          </div>
          <SearchBar />
          <div className="text-sm font-medium leading-5  text-slate-500 p-4">
            Recent
            <div className="flex flex-row">
              <Link to={"tocontact"}>
                <img src={icon} alt="Buffr logo" />
              </Link>

              <img src={icon} alt="Buffr logo" />
              <img src={icon} alt="Buffr logo" />
            </div>
          </div>
          <div className="text-sm font-medium leading-5  text-slate-500 p-4">
            Recent
            <div className="flex flex-row">
              <img src={icon} alt="Buffr logo" />
              <img src={icon} alt="Buffr logo" />
              <img src={icon} alt="Buffr logo" />
            </div>
          </div>
          <div className="text-sm font-medium leading-5  text-slate-500 p-4">
            Contacts
            <img src={icon} alt="Buffr logo" />
            <img src={icon} alt="Buffr logo" />
            <img src={icon} alt="Buffr logo" />
          </div>
        </div>
      </div>
    </>
  );
};

export default SendingPage;
