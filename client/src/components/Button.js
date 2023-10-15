import React, { memo } from "react";
import clsx from "clsx";

const Button = ({
  children,
  handleOnClick,
  style,
  widthFull,
  disabled,
  type = "button",
}) => {
  return (
    <>
      <button
        disabled={disabled}
        type={type}
        className={clsx(
          "px-4 py-2 text-white text-semibold bg-main",
          widthFull ? "w-full" : "w-fit",
          disabled && "cursor-not-allowed opacity-50",
          style
        )}
        onClick={() => {
          handleOnClick && handleOnClick();
        }}
      >
        {children}
      </button>
    </>
  );
};

export default memo(Button);
