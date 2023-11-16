import React, { memo } from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";

const QuantitySelector = ({
  quantity,
  handleQuantity,
  onChangeQuantity,
  onStock,
}) => {
  return (
    <div className="border flex items-center h-10 bg-white">
      <span
        onClick={() => onChangeQuantity("decrease", onStock)}
        className="p-2 cursor-pointer border-r "
      >
        <AiOutlineMinus size={14} />
      </span>
      <input
        className="md:py-2 md:px-4 outline-none w-[30px] md:w-[60px] text-center border"
        type="text"
        value={quantity}
        onChange={(e) => handleQuantity(e.target.value, onStock)}
      />
      <span
        onClick={() => onChangeQuantity("increase", onStock)}
        className="p-2 cursor-pointer border-l "
      >
        <AiOutlinePlus size={14} />
      </span>
    </div>
  );
};

export default memo(QuantitySelector);
