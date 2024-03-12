import React from "react";
import { IoMegaphoneOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

const NotificationBtn = () => {
  return (
    <div>
      <Link to={"/notification"}>
        <IoMegaphoneOutline size={25} />
      </Link>
    </div>
  );
};

export default NotificationBtn;
