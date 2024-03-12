import { IoPhonePortraitOutline } from "react-icons/io5";
import { HiOutlineTicket } from "react-icons/hi2";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { FaRegStar } from "react-icons/fa";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { BsLayoutWtf } from "react-icons/bs";

const GridComponent = () => {
  return (
    <div className="grid grid-cols-3 gap-4 p-4 pb-5">
      <div className="border bg-gray-50 p-4 text-center flex flex-col items-center justify-center rounded-2xl">
        <IoPhonePortraitOutline className="text-3xl mb-2 text-blue-500" />
        Mobile Recharge
      </div>
      <div className="border bg-gray-50 p-4 text-center flex flex-col items-center justify-center rounded-2xl">
        <HiOutlineTicket className="text-3xl mb-2 text-blue-500" />
        Buy Tickets
      </div>
      <div className="border bg-gray-50 p-4 text-center flex flex-col items-center justify-center rounded-2xl">
        <HiOutlineClipboardDocumentList className="text-3xl mb-2 text-blue-500" />
        Your Subscriptions
      </div>
      <div className="border bg-gray-50 p-4 text-center flex flex-col items-center justify-center rounded-2xl">
        <FaRegStar className="text-3xl mb-2 text-blue-500" />
        Sponsored [section]
      </div>
      <div className="border bg-gray-50 p-4 text-center flex flex-col items-center justify-center rounded-2xl">
        <IoShieldCheckmarkOutline className="text-3xl mb-2 text-blue-600" />
        All Insurance
      </div>
      <div className="border bg-gray-50 p-4 text-center flex flex-col items-center justify-center rounded-2xl">
        <BsLayoutWtf className="text-3xl mb-2 text-blue-600" />
        Explore Utilities
      </div>
    </div>
  );
};

export default GridComponent;
