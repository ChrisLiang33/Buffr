import React from "react";
import BackBtn from "./Btns/BackBtn";
import icon from "../assets/icon.svg";

const AddWallet = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1">
        <div className="flex gap-5 justify-between px-4 py-2 bg-white max-w-[393px]">
          <BackBtn />
          <div className="my-auto text-lg font-medium leading-7 text-center text-slate-950">
            Add Wallet
          </div>
          <div className="flex justify-center items-center px-4 w-14 h-14 bg-white aspect-square rounded-full"></div>
        </div>
        <div className="flex justify-center">
          <img src={icon} alt="" />
        </div>
        <p className="flex justify-center">set icon</p>
        <div className="flex flex-col">
          Wallet Name
          <input
            type="text"
            placeholder="Savings for PS5"
            className="bg-gray-200 rounded-2xl"
          />
        </div>
        <div>
          auto pay
          <p>Fluffy servant sirius the quaffle sight</p>
        </div>
        <button>save</button>
      </div>
    </div>
  );
};

export default AddWallet;
