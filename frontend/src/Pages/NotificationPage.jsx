import React from "react";
import BackBtn from "../components/Btns/BackBtn";
import notification from "../assets/notification.svg";

const NotificationPage = () => {
  return (
    <>
      <br />
      <div className="flex flex-col min-h-screen">
        <div className="flex-1">
          <div className="flex gap-5 justify-between px-4 py-2 bg-white max-w-[393px]">
            <BackBtn />
            <div className="my-auto text-lg font-medium leading-7 text-center text-slate-950">
              Notifications
            </div>
            <div className="flex justify-center items-center px-4 w-14 h-14 bg-white aspect-square rounded-full"></div>
          </div>
          <div className="flex flex-col items-center text-center pt-20">
            <img
              src={notification}
              alt="notification logo"
              className="w-48 h-48 mb-4"
            />
            <div className="text-4xl font-semibold mb-2">
              Notifications Not Available
            </div>
            <div className="text-sm text-gray-600 px-4">
              Head lily or giant glasses it and. Tonight a pumpkin snargaluff
              nose plums
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationPage;
