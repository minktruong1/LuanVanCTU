import React, { memo, Fragment, useState } from "react";
import { customerSidebar } from "../ultils/contants";
import { Link, NavLink } from "react-router-dom";
import clsx from "clsx";
import { BiSolidDownArrow, BiSolidUpArrow } from "react-icons/bi";
import { useSelector } from "react-redux";
import defaultAvatar from "../assets/userAvatar.jpg";

const activeStyling = "px-4 py-2 flex items-center gap-2 text-[#e30019] ";
const unActiveStyling =
  "px-4 py-2 flex items-center gap-2 hover:text-[#e30019]";

const CustomerSidebar = () => {
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
    <div className="bg-white h-full rounded-sm min-h-[450px]">
      <div className="w-full flex items-center p-4 border-b border-[#ECECEC]">
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
            {element.type === "SINGLE" && (
              <NavLink
                to={element.path}
                className={({ isActive }) =>
                  clsx(isActive && activeStyling, !isActive && unActiveStyling)
                }
              >
                <span>{element.text}</span>
              </NavLink>
            )}
            {element.type === "PARENT" && (
              <div
                onClick={() => handleToggle(+element.id)}
                className=" flex flex-col "
              >
                <div className="flex items-center justify-between gap-2 hover:bg-overlay px-4 py-2 cursor-pointer">
                  <span>{element.text}</span>
                  {active.some((id) => id === element.id) ? (
                    <BiSolidUpArrow />
                  ) : (
                    <BiSolidDownArrow />
                  )}
                </div>
                {active.some((id) => +id === +element.id) && (
                  <div className="flex flex-col ">
                    {element.submenu?.map((item) => (
                      <NavLink
                        key={element.text}
                        to={item.path}
                        onClick={(e) => e.stopPropagation()}
                        className={({ isActive }) =>
                          clsx(
                            isActive && activeStyling,
                            !isActive && unActiveStyling,
                            "pl-10"
                          )
                        }
                      >
                        {item.text}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default memo(CustomerSidebar);
