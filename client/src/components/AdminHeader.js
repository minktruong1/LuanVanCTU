import React from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { showAdminSidebar } from "../store/app/appSlice";
import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";

const AdminHeader = () => {
  const dispatch = useDispatch();

  const toggleAdminSidebar = () => {
    dispatch(showAdminSidebar());
  };

  return (
    <div
      className={clsx(
        "h-[60px] w-full fixed top-0 flex items-center p-4 border-b bg-white z-50 drop-shadow-2xl"
      )}
    >
      <span className="cursor-pointer" onClick={() => toggleAdminSidebar()}>
        <AiOutlineMenu />
      </span>
    </div>
  );
};

export default AdminHeader;
