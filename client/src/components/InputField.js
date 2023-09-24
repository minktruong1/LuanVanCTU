import React, { useState } from "react";

const InputField = ({
  value,
  setValue,
  nameKey,
  type,
  invalidFields,
  setInvalidFields,
  placeholder,
}) => {
  return (
    <div className="w-full relative">
      {value.trim() !== "" && (
        <label
          htmlFor={nameKey}
          className="text-[12px] animate-slide-top-sm absolute top-0 left-[12px] block bg-white px-1"
        >
          {placeholder
            ? `${placeholder}`
            : `${nameKey?.slice(0, 1).toUpperCase() + nameKey?.slice(1)}`}
        </label>
      )}
      <input
        type={type || "text"}
        name=""
        id=""
        className="px-4 py-2 border w-full my-2 outline-none "
        placeholder={
          placeholder
            ? `${placeholder}`
            : `${nameKey?.slice(0, 1).toUpperCase() + nameKey?.slice(1)}`
        }
        value={value}
        onChange={(e) =>
          setValue((prev) => ({ ...prev, [nameKey]: e.target.value }))
        }
      />
    </div>
  );
};

export default InputField;
