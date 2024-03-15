import React, { useState } from "react";
import { Link } from "react-router-dom";
import SliderBar from "./SliderBar";
import CardBtn from "./Btns/CardBtn";

const BankAccountComponent = () => {
  const balance = 5000;
  const [show, setShow] = useState(false);

  const handleShow = () => {
    setShow(!show);
  };

  const handleAdd = () => {};

  const handleLargeAction = () => {};

  return (
    <div className="p-4 max-w-sm mx-auto bg-white space-y-2">
      <div className="text-center text-black">
        <SliderBar />
        <div className="mt-2">
          <span
            style={{
              color: "var(--text-gray-50, #64748B)",
              // fontFamily: '"SF Pro Text"',
              fontSize: "20px",
              fontStyle: "normal",
              fontWeight: "400",
              lineHeight: "28px",
            }}
            className="px-2 text-2xl"
          >
            N$
          </span>
          <span className="font-bold text-3xl">{show ? balance : "XXX"}</span>
        </div>
      </div>
      <div className="text-center font-medium text-sm text-gray-600">
        Total Balance
      </div>

      <div className="flex justify-center gap-2">
        <button
          onClick={handleShow}
          className="flex h-7 items-center justify-center px-3 py-1 gap-2 rounded-full text-black transition duration-300"
          style={{ backgroundColor: "var(--surface-gray-10, #F1F5F9)" }} // Custom property or fallback value
        >
          {show ? "Hide" : "Show"}
        </button>

        <Link
          to="/addmoney"
          onClick={handleAdd}
          className="flex h-7 items-center justify-center px-3 pl-1.5 py-1.5 rounded-full text-black transition duration-300"
          style={{ border: "1px solid var(--strokes-gray-20, #E2E8F0)" }} // Custom property for the border
        >
          + Add
        </Link>
      </div>

      <div className="mt-4 flex justify-center">
        <Link
          to={"/card"}
          onClick={handleLargeAction}
          className="px-6 py-3 text-black rounded transition duration-300"
        >
          <CardBtn />
        </Link>
      </div>
    </div>
  );
};

export default BankAccountComponent;
