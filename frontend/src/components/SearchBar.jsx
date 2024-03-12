import React from "react";
import { FiSearch } from "react-icons/fi";

const SearchBar = () => {
  return (
    <div className="flex justify-center mt-4">
      <div className="flex items-center bg-white border-2 border-gray-300 rounded-full focus-within:border-blue-500">
        <FiSearch className="ml-3 text-gray-500 w-5 h-5" />
        <input
          type="text"
          placeholder="Search anything..."
          className="pl-2 py-2 rounded-full focus:outline-none w-full"
        />
      </div>
    </div>
  );
};

export default SearchBar;
