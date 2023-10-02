import React, { memo } from "react";

const InputSelector = ({ value, changeValue, options }) => {
  return (
    <>
      <select
        className="form-select text-sm"
        value={value}
        onChange={(e) => changeValue(e.target.value)}
      >
        <option value="">Xếp theo</option>
        {options?.map((element) => (
          <option key={element.id} value={element.value}>
            {element.text}
          </option>
        ))}
      </select>
    </>
  );
};

export default memo(InputSelector);
