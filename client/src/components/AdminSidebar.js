import React, { memo, Fragment, useState } from "react";
import { adminSidebar } from "../ultils/contants";
import { Link, NavLink } from "react-router-dom";
import clsx from "clsx";
import { BiSolidDownArrow, BiSolidUpArrow } from "react-icons/bi";
import { useSelector } from "react-redux";

const activeStyling = "px-4 py-2 flex items-center gap-2 bg-overlay ";
const unActiveStyling = "px-4 py-2 flex items-center gap-2 hover:bg-overlay";

const AdminSidebar = () => {
  const [active, setActive] = useState([]);

  const { isShowAdminSidebar } = useSelector((state) => state.appReducer);

  const handleToggle = (tabID) => {
    if (active.some((element) => element === tabID)) {
      setActive((prev) => prev.filter((element) => element !== tabID));
    } else {
      setActive((prev) => [...prev, tabID]);
    }
  };

  return (
    <div
      className={clsx(
        "bg-[#10163a] fixed top-0 bottom-0 left-0 h-full py-4 duration-300 z-50  ",
        isShowAdminSidebar ? "w-fit" : "translate-x-[-100%]"
      )}
    >
      <Link
        to={"/admin/dashboard"}
        className="flex flex-col justify-center items-center py-2 "
      >
        <span className={clsx("text-4xl font-extrabold ")}>WORK STATION</span>
      </Link>
      <div className={clsx("text-lg")}>
        {adminSidebar.map((element) => (
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

export default memo(AdminSidebar);
