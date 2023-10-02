import React, { memo } from "react";

const QuantitySelector = ({
  quantity,
  handleQuantity,
  onChangeQuantity,
  onStock,
}) => {
  return (
    <div className="flex items-center ">
      <div className="border">
        <span
          // onClick={onChangeQuantity}
          onClick={() => onChangeQuantity("decrease", onStock)}
          className="text-[20px] p-2 cursor-pointer border-r"
        >
          -
        </span>
        <input
          className="py-2 px-4 outline-none w-[60px] text-center"
          type="text"
          value={quantity}
          onChange={(e) => handleQuantity(e.target.value, onStock)}
        />
        <span
          onClick={() => onChangeQuantity("increase", onStock)}
          className="text-[20px] p-2 cursor-pointer border-l"
        >
          +
        </span>
      </div>
    </div>
  );
};

export default memo(QuantitySelector);
