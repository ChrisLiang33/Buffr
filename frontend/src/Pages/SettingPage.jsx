import React from "react";
import BackBtn from "../components/Btns/BackBtn";
import QRPage from "./QRPage";
import icon from "../assets/icon.svg";

const Setting = () => {
  return (
    <>
      <br />
      <div className="flex flex-col min-h-screen">
        <div className="flex-1">
          <div className="flex gap-5 justify-between px-4 py-2 bg-white max-w-[393px]">
            <BackBtn />
            <div className="my-auto text-lg font-medium leading-7 text-center text-slate-950">
              Settings
            </div>
            <div className="flex justify-center items-center px-4 w-14 h-14 bg-white aspect-square rounded-full">
              <QRPage />
            </div>
          </div>
          <div>
            <div className="flex justify-center">
              {" "}
              {/* This container uses flexbox to center its children horizontally */}
              <div className="flex items-center space-x-4">
                {" "}
                {/* Your content container remains unchanged, with items inline */}
                <img src={icon} alt="" className="w-16 h-16 rounded-full" />{" "}
                {/* Your image */}
                <div className="flex flex-col">
                  <p className="font-semibold">olivia nangula</p> {/* Name */}
                  <p className="text-sm text-gray-600">
                    olivia.nanguala@br
                  </p>{" "}
                  {/* Email */}
                </div>
              </div>
            </div>
            <header className="font-bold">Connected</header>
            <p>Bank Accounts</p>
            <p>Cards</p>
            <header className="font-bold">Sound</header>
            <p>Notification</p>
            <header className="font-bold">Security</header>
            <p>2 Factor Authentication</p>
            <p>Active Sessions</p>
            <header className="font-bold">Support</header>
            <p>FAQ's</p>
            <p>Contact Support</p>
            <p>Submit Feedback</p>
          </div>
          <button className="bg-red-500">Log Out</button>
        </div>
      </div>
    </>
  );
};

export default Setting;
