import React, { useState } from "react";
import { Link } from "react-router-dom";
import SliderBar from "./SliderBar";
import CardBtn from "./Btns/CardBtn";
import ResponsiveContainer from "./layout/ResponsiveContainer";

const BankAccountComponent = () => {
  const balance = 5000;
  const [show, setShow] = useState(false);

  const handleShow = () => {
    setShow(!show);
  };

  const handleAdd = () => {};

  const handleLargeAction = () => {};

  return (
    <ResponsiveContainer maxWidth="600px" className="py-6">
      <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
        <div className="text-center text-black">
          <SliderBar />
          <div className="mt-4">
            <span
              style={{
                color: "var(--text-gray-50, #64748B)",
                fontSize: "clamp(16px, 2.5vw, 24px)",
                fontStyle: "normal",
                fontWeight: "400",
                lineHeight: "1.4",
              }}
              className="px-2"
            >
              N$
            </span>
            <span className="font-bold text-3xl sm:text-4xl lg:text-5xl">
              {show ? balance.toLocaleString() : "XXX"}
            </span>
          </div>
        </div>

        <div className="text-center font-medium text-sm sm:text-base text-gray-600">
          Total Balance
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
          <button
            onClick={handleShow}
            className="flex h-10 sm:h-12 items-center justify-center px-4 py-2 gap-2 rounded-full text-black transition duration-300 hover:bg-gray-100"
            style={{ backgroundColor: "var(--surface-gray-10, #F1F5F9)" }}
          >
            {show ? "Hide" : "Show"}
          </button>

          <Link
            to="/addmoney"
            onClick={handleAdd}
            className="flex h-10 sm:h-12 items-center justify-center px-4 py-2 rounded-full text-black transition duration-300 hover:bg-gray-50"
            style={{ border: "1px solid var(--strokes-gray-20, #E2E8F0)" }}
          >
            + Add
          </Link>
        </div>

        <div className="mt-6 flex justify-center">
          <Link
            to={"/card"}
            onClick={handleLargeAction}
            className="px-6 py-3 text-black rounded transition duration-300 hover:bg-gray-50"
          >
            <CardBtn />
          </Link>
        </div>
      </div>
    </ResponsiveContainer>
  );
};

export default BankAccountComponent;
