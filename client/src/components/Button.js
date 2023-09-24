import React, { memo } from "react";

const Button = ({ name, handleOnClick, style, wFull }) => {
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
        <span>{name}</span>
      </button>
    </>
  );
};

export default memo(Button);
