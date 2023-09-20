import React from "react";
import { navigation } from "../ultils/contants.js";
import { NavLink } from "react-router-dom";

const Navigation = () => {
  return (
    <div className="w-main h-[48px] text-sm font-semibold py-2 flex justify-between items-center">
      {navigation.map((element, index) => (
        <div
          className={`px-6 ${
            index !== navigation.length - 1 ? "border-divider" : ""
          } `}
          key={element.id}
        >
          <NavLink
            className="flex flex-row hover:text-red-600"
            to={element.path}
          >
            <span className="flex gap-4 items-center text-[20px] pr-2">
              {element.icon}
            </span>
            {element.value}
          </NavLink>
        </div>
      ))}
    </div>
  );
};

export default Navigation;
