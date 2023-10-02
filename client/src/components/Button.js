import React, { memo } from "react";

const Button = ({ children, handleOnClick, style, wFull }) => {
  return (
    <>
      <button
        type="button"
        className={
          style
            ? style
            : `px-4 py-2 text-white text-semibold bg-main ${
                wFull ? `w-full` : `w-fit`
              }`
        }
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
