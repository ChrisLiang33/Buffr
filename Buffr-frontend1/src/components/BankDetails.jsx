import React from "react";

const BankAccountComponent = () => {
  const balance = 1000; // Hard-coded balance

  const handleShow = () => {
    // Placeholder function for show action
    console.log("Show action");
  };

  const handleAdd = () => {
    // Placeholder function for add action
    console.log("Add action");
  };

  const handleLargeAction = () => {
    // Placeholder function for the large button action
    console.log("Large button action");
  };

  return (
    <div className="p-4 max-w-sm mx-auto bg-white rounded-xl shadow-md space-y-2">
      <div className="text-center font-medium text-lg">Bank Account</div>
      <div className="text-center text-gray-500">Balance: ${balance}</div>
      <div className="flex justify-center gap-2">
        <button
          onClick={handleShow}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300"
        >
          Show
        </button>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 transition duration-300"
        >
          Add
        </button>
      </div>
      <div className="mt-4 flex justify-center">
        <button
          onClick={handleLargeAction}
          className="px-6 py-3 bg-red-500 text-white rounded hover:bg-red-700 transition duration-300"
        >
          Large Button
        </button>
      </div>
    </div>
  );
};

export default BankAccountComponent;
