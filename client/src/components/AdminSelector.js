import React, { memo } from "react";
import clsx from "clsx";

const AdminSelector = ({
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
    <div className={clsx("flex flex-col gap-2", style)}>
      {label && <label htmlFor={id}>{label}</label>}
      <select
        defaultValue={defaultValue}
        id={id}
        {...register(id, validate)}
        className={clsx("form-select ", fullWidth && "w-full")}
      >
        <option value="">Chọn</option>

        {options?.map((element) => (
          <option value={element?.value}>{element?.text}</option>
        ))}
      </select>
      {errors[id] && (
        <small className="text-xs text-red-500">{errors[id]?.message}</small>
      )}
    </div>
  );
};

export default memo(AdminSelector);
