import React, { memo } from "react";
import clsx from "clsx";

const UserUpdateSelector = ({
  label,
  options = [],
  register,
  errors,
  id,
  validate,
  style,
  fullWidth,
  defaultValue,
}) => {
  return (
    <div className="flex flex-col gap-2">
      {label && <label htmlFor={id}>{label}</label>}
      <select
        defaultValue={defaultValue}
        id={id}
        {...register(id, validate)}
        className={clsx("form-select", fullWidth && "w-full", style)}
      >
        <option value="">--Chọn--</option>
        {id === "role" &&
          options?.map((element) => (
            <option value={element?.text}>{element?.text}</option>
          ))}
        {id === "isBlocked" &&
          options?.map((element) => (
            <option value={element?.isBlock}>{element?.text}</option>
          ))}
      </select>
      {errors[id] && (
        <small className="text-xs text-red-500">{errors[id]?.message}</small>
      )}
    </div>
  );
};

export default memo(UserUpdateSelector);
