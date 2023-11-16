import React, { memo, Fragment, useState } from "react";
import { customerSidebar } from "../ultils/contants";
import { NavLink } from "react-router-dom";
import clsx from "clsx";
import { useSelector } from "react-redux";
import defaultAvatar from "../assets/userAvatar.jpg";
import { RiLogoutBoxRFill } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { logout } from "../store/users/userSlice";

const activeStyling = "px-4 py-2 flex items-center gap-2 text-[#e30019] ";
const unActiveStyling =
  "px-4 py-2 flex items-center gap-2 hover:text-[#e30019]";

const CustomerSidebar = () => {
  const dispatch = useDispatch();
  const [active, setActive] = useState([]);
  const { currentData } = useSelector((state) => state.user);

  const handleToggle = (tabID) => {
    if (active.some((element) => element === tabID)) {
      setActive((prev) => prev.filter((element) => element !== tabID));
    } else {
      setActive((prev) => [...prev, tabID]);
    }
  };

  return (
    <div className="bg-white md:h-full rounded-sm md:max-h-[500px] mb-4">
      <div className="flex items-center p-4 border-b border-[#ECECEC]">
        <img
          src={currentData?.avatar || defaultAvatar}
          alt="avatar"
          className="w-[60px] h-[60px] rounded-full"
        />
        <span className="text-[18px] font-medium ml-6">
          {currentData?.firstName} {currentData?.lastName}
        </span>
      </div>
      <div className="text-medium">
        {customerSidebar.map((element) => (
          <Fragment key={element.id}>
            <NavLink
              to={element.path}
              className={({ isActive }) =>
                clsx(isActive && activeStyling, !isActive && unActiveStyling)
              }
            >
              {element.icon}
              <span>{element.text}</span>
            </NavLink>
          </Fragment>
        ))}
        <span className="px-4 py-2 flex items-center border-t">
          <RiLogoutBoxRFill />
          <span
            onClick={() => dispatch(logout())}
            className="ml-2 cursor-pointer hover:text-main"
          >
            Đăng xuất
          </span>
        </span>
      </div>
    </div>
  );
};

export default memo(CustomerSidebar);
