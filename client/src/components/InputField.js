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
    <div className="w-full relative flex flex-col mb-2">
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
        className="px-4 py-2 border w-full mt-2 outline-none "
        placeholder={
          placeholder
            ? `${placeholder}`
            : `${nameKey?.slice(0, 1).toUpperCase() + nameKey?.slice(1)}`
        }
        value={value}
        onChange={(e) =>
          setValue((prevData) => ({ ...prevData, [nameKey]: e.target.value }))
        }
        onFocus={() => {
          setInvalidFields([]);
        }}
      />

      {invalidFields &&
        invalidFields.some((element) => element.name === nameKey) && (
          <small className="text-[11px] text-red-600 italic">
            {invalidFields.find((element) => element.name === nameKey)?.message}
          </small>
        )}
    </div>
  );
};

export default InputField;
