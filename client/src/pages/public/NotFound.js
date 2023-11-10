import React from "react";
import { Button, Result } from "antd";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="w-full h-full bg-webBackground">
      <div className="flex flex-col justify-center items-center w-full h-full">
        <Result status="404" title="404" />
        <div className="text-4xl">Trang bạn tìm không tồn tại</div>
        <Link
          to={`/`}
          className="p-3 bg-blue-600 text-white text-xl rounded-md"
        >
          Về trang chủ
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
