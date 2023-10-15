import React, { memo } from "react";
import clsx from "clsx";

const ReactInputForm = ({
  label,
  disable,
  register,
  errors,
  id,
  validate,
  type = "text",
  placeholder,
  defaultValue,
  style,
  fullWidth,
}) => {
  return (
    <div className={clsx("max-h-[42px]", style)}>
      {label && <label htmlFor={id}>{label}</label>}
      <input
        type={type}
        id={id}
        {...register(id, validate)}
        disabled={disable}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className={clsx("form-input", fullWidth && "w-full")}
      />
      {errors[id] && (
        <small className="text-xs text-red-600">{errors[id]?.message}</small>
      )}
    </div>
  );
};

export default memo(ReactInputForm);
