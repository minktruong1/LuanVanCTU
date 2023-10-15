import React, { memo } from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";

const QuantitySelector = ({
  quantity,
  handleQuantity,
  onChangeQuantity,
  onStock,
}) => {
  return (
    <div className="border flex items-center">
      <span
        // onClick={onChangeQuantity}
        onClick={() => onChangeQuantity("decrease", onStock)}
        className="text-[20px] p-2 cursor-pointer border-r "
      >
        <AiOutlineMinus size={14} />
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
        <AiOutlinePlus size={14} />
      </span>
    </div>
  );
};

export default memo(QuantitySelector);
