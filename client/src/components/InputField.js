import React, { useState } from "react";
import clsx from "clsx";

const InputField = ({
  value,
  setValue,
  nameKey,
  type,
  invalidFields,
  setInvalidFields,
  placeholder,
  style,
  fullWidth,
  isShowLabel,
}) => {
  return (
    <div
      className={clsx(
        "w-full relative flex flex-col mb-2",
        fullWidth && "w-full"
      )}
    >
      {!isShowLabel && value.trim() !== "" && (
        <label
          htmlFor={nameKey}
          className="text-[12px] animate-slide-top-sm absolute top-0 left-[12px] block bg-white px-1"
        >
          {placeholder ||
            `${nameKey?.slice(0, 1).toUpperCase() + nameKey?.slice(1)}`}
        </label>
      )}
      <input
        type={type || "text"}
        className={clsx("px-4 py-2 border w-full mt-2 outline-none ", style)}
        placeholder={
          placeholder
            ? `${placeholder}`
            : `${nameKey?.slice(0, 1).toUpperCase() + nameKey?.slice(1)}`
        }
        value={value}
        onChange={(e) =>
          setValue((prevData) => ({ ...prevData, [nameKey]: e.target.value }))
        }
        onFocus={() => setInvalidFields && setInvalidFields([])}
      />

      {invalidFields?.some((element) => element.name === nameKey) && (
        <small className="text-[11px] text-red-600 italic">
          {invalidFields.find((element) => element.name === nameKey)?.message}
        </small>
      )}
    </div>
  );
};

export default InputField;
