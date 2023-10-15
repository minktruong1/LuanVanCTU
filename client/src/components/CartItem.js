import React, { useEffect, useState } from "react";
import { apiRemoveProductFromCart } from "../apis";
import { useDispatch } from "react-redux";
import { apiGetCurrentAccount } from "../store/users/asyncActions";
import { toast } from "react-toastify";
import { BiTrash } from "react-icons/bi";
import QuantitySelector from "./QuantitySelector";
import { formatVND } from "../ultils/helpers";
import { updateCart } from "../store/users/userSlice";
import { Link } from "react-router-dom";

const CartItem = ({ element, firstQuantity = 1 }) => {
  const dispatch = useDispatch();
  const [quantitySelect, setQuantitySelect] = useState(() => firstQuantity);

  const handleQuantity = (number, onStock) => {
    number = Number(number);
    if (!number || number < 1 || number > onStock) {
      return;
    } else {
      setQuantitySelect(number);
    }
  };
  const handleButtonFunction = (math, onStock) => {
    if (math === "decrease" && quantitySelect === 1) {
      return;
    }
    if (math === "decrease") {
      setQuantitySelect((previousNum) => +previousNum - 1);
    }
    if (math === "increase" && quantitySelect >= onStock) {
      return;
    }
    if (math === "increase") {
      setQuantitySelect((previousNum) => +previousNum + 1);
    }
  };

  const handleRemoveItem = async (pid) => {
    const response = await apiRemoveProductFromCart(pid);
    if (response.success) {
      dispatch(apiGetCurrentAccount());
    } else {
      toast.error(response.message);
    }
  };

  useEffect(() => {
    dispatch(
      updateCart({ pid: element?.product?._id, quantity: quantitySelect })
    );
  }, [quantitySelect]);

  // console.log(updateCart);
  return (
    <div className="flex mb-6">
      <div className="w-[20%] flex flex-col items-center">
        <Link
          to={`/${element?.product?.category?.toLowerCase()}/${
            element?.product?._id
          }/${element?.product?.title}`}
          className="line-clamp-1"
        >
          <img
            src={element?.product?.images[0]}
            alt="productImage"
            className="w-[88px] h-[88px] object-cover border"
          />
        </Link>
        <span
          onClick={() => handleRemoveItem(element?.product?._id)}
          className="flex text-[14px] items-center cursor-pointer text-[#6d6e72] hover:text-main mt-2"
        >
          <BiTrash />
          <span className="ml-2">Xóa</span>
        </span>
      </div>
      <div className="w-[55%]">
        <Link
          to={`/${element?.product?.category?.toLowerCase()}/${
            element?.product?._id
          }/${element?.product?.title}`}
          className="line-clamp-1"
        >
          <span className="line-clamp-1">{element?.product?.title}</span>
        </Link>
      </div>
      <div className="w-[25%] text-right flex flex-col">
        <span className=" text-main mb-4 font-medium text-[18px]">
          {`${formatVND(element?.product?.price * quantitySelect)}đ`}
        </span>
        <div className="flex justify-end">
          <QuantitySelector
            quantity={quantitySelect}
            handleQuantity={handleQuantity}
            onChangeQuantity={handleButtonFunction}
            onStock={element?.product?.quantity}
          />
        </div>
      </div>
    </div>
  );
};

export default CartItem;
