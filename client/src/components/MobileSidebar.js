import icons from "../ultils/icons";
import React from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { showModal } from "../store/app/appSlice";
import { slugifyByHand } from "../ultils/helpers";
import { Link } from "react-router-dom";

const { FaTimes } = icons;

const MobileSidebar = () => {
  const dispatch = useDispatch();

  const { categories } = useSelector((state) => state.appReducer);

  return (
    <div className="fixed top-0 left-0 w-[70%] bg-white h-full animate-slide-from-left  origin-left">
      <div>
        <div className="bg-main p-4 text-white flex justify-between text-sm items-center leading-[18px]">
          <span className="uppercase">Danh mục sản phẩm</span>
          <FaTimes
            onClick={() =>
              dispatch(
                showModal({
                  isShowModal: false,
                  modalContent: null,
                })
              )
            }
            size={20}
          />
        </div>
        <div>
          <ul className="uppercase">
            {categories?.map((element) => (
              <Link to={slugifyByHand(element.title)}>
                <li className="px-[20px] py-[12px] border border-b text-[13px]">
                  {element.title}
                </li>
              </Link>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MobileSidebar;
