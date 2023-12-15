import React, { memo, Fragment, useState } from "react";
import { adminSidebar } from "../ultils/contants";
import { Link, NavLink, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { BiSolidDownArrow, BiSolidUpArrow } from "react-icons/bi";
import { useSelector } from "react-redux";
import { MdBackup } from "react-icons/md";

const activeStyling = "px-4 py-2 flex items-center gap-2 bg-[#26baee] ";
const unActiveStyling = "px-4 py-2 flex items-center gap-2 hover:bg-[#26baee]";

const AdminSidebar = () => {
  const [active, setActive] = useState([]);
  const navigate = useNavigate();

  const { isShowAdminSidebar } = useSelector((state) => state.appReducer);

  const handleToggle = (tabID) => {
    if (active.some((element) => element === tabID)) {
      setActive((prev) => prev.filter((element) => element !== tabID));
    } else {
      setActive((prev) => [...prev, tabID]);
    }
  };

  const handleExport = async () => {
    const enteredPassword = window.prompt("Nhập mật khẩu cấp 2:");

    if (enteredPassword === "admin") {
      window.open("http://localhost:5000/api/export/all");
    } else {
      alert("Mật khẩu cấp 2 không chính xác");
    }
  };

  return (
    <div
      className={clsx(
        "bg-[#9fe8fa] text-black fixed top-0 bottom-0 left-0 h-full py-4 duration-300 z-30 overflow-x-auto text-lg",
        isShowAdminSidebar ? "w-fit" : "translate-x-[-100%]"
      )}
    >
      <Link
        to={"/admin/product-dashboard"}
        className="flex flex-col justify-center items-center py-2 "
      >
        <span className={clsx("text-4xl font-extrabold")}>QUAN LY</span>
      </Link>
      <div>
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
                className="flex flex-col "
              >
                <div className="flex items-center justify-between gap-2 hover:bg-[#26baee] px-4 py-2 cursor-pointer">
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
      <div className="px-4 py-2">
        <div
          onClick={() => handleExport()}
          className="uppercase flex items-center cursor-pointer"
        >
          <MdBackup size={26} />
          <span className="ml-2">Lưu trữ dữ liệu</span>
        </div>
      </div>
    </div>
  );
};

export default memo(AdminSidebar);
