import React, { useEffect, useState } from "react";
import { apiRemoveProductFromCart, apiUpdateCart } from "../apis";
import { useDispatch } from "react-redux";
import { apiGetCurrentAccount } from "../store/users/asyncActions";
import { toast } from "react-toastify";
import { BiTrash } from "react-icons/bi";
import QuantitySelector from "./QuantitySelector";
import { formatVND } from "../ultils/helpers";
import { updateCart } from "../store/users/userSlice";
import { Link } from "react-router-dom";
import clsx from "clsx";

const CartItem = ({ element, firstQuantity = 1 }) => {
  const dispatch = useDispatch();
  const [quantitySelect, setQuantitySelect] = useState(() => firstQuantity);
  const [outOfStock, setOutOfStock] = useState(false);

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
      //quick rerender
      dispatch(apiGetCurrentAccount());
    } else {
      toast.error(response.message);
    }
  };

  const updateCartItemQuantity = async (productId, newQuantity) => {
    const response = await apiUpdateCart({
      pid: productId,
      quantity: newQuantity,
    });
    if (response.success) {
      dispatch(updateCart({ pid: productId, quantity: newQuantity }));
    }
  };

  useEffect(() => {
    updateCartItemQuantity(element?.product?._id, quantitySelect);
    if (quantitySelect > element.product.quantity) {
      setOutOfStock(true);
    } else {
      setOutOfStock(false);
    }
  }, [quantitySelect]);

  return (
    <div className={clsx("grid grid-cols-5 md:grid-cols-5 mb-6 relative p-2")}>
      {outOfStock && (
        <div className="absolute bg-black bg-opacity-30 w-full h-full flex justify-center items-center z-10">
          <span className="text-main -rotate-12 font-semibold ">
            Chỉ còn {element?.product?.quantity} sản phẩm
          </span>
        </div>
      )}
      <div className="grid grid-rows-1 gap-3 place-content-center">
        <Link
          to={`/${element.category?.toLowerCase()}/${element?.product._id}/${
            element?.product.slug
          }`}
          className="line-clamp-1"
        >
          <img
            src={element?.images[0]}
            alt="productImage"
            className="w-[68px] h-[68px] md:w-[88px] md:h-[88px] object-cover border"
          />
        </Link>
        <span
          onClick={() => handleRemoveItem(element?.product?._id)}
          className="flex place-content-center text-[14px] items-center cursor-pointer text-[#6d6e72] hover:text-main"
        >
          <BiTrash />
          <span className="ml-1">Xóa</span>
        </span>
      </div>
      <div className="col-span-4">
        <div className="grid grid-rows-1 md:grid-cols-3">
          <div className="md:col-span-2">
            <Link
              to={`/${element.category?.toLowerCase()}/${
                element?.product._id
              }/${element?.product.slug}`}
              className="md:line-clamp-1 "
            >
              <span className="text-sm md:text-base">{element?.title}</span>
            </Link>
          </div>
          <div className="text-right z-20">
            <span className=" text-main mb-4 font-medium text-base md:text-[18px] ">
              {`${formatVND(element?.price * quantitySelect)}đ`}
            </span>
            <div className="flex justify-end ">
              <QuantitySelector
                quantity={quantitySelect}
                handleQuantity={handleQuantity}
                onChangeQuantity={handleButtonFunction}
                onStock={element?.product?.quantity}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
