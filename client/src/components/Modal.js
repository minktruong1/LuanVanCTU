import React, { memo } from "react";
import { useDispatch } from "react-redux";
import { showModal } from "../store/app/appSlice";

const Modal = ({ children }) => {
  const dispatch = useDispatch();

  return (
    <div
      onClick={() =>
        dispatch(showModal({ isShowModal: false, modalContent: null }))
      }
      className="fixed inset-0 bg-overlay z-50"
    >
      {children}
    </div>
  );
};

export default memo(Modal);
