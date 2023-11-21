import React from "react";
import { Button, Result } from "antd";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

const NotFound = () => {
  return (
    <div className="w-full h-full bg-webBackground">
      <div className="flex flex-col justify-center items-center w-full h-screen">
        <Result status="404" title="404" />
        <div className="text-4xl text-center">Trang bạn tìm không tồn tại</div>
        <Link
          to={`/`}
          className="p-3 bg-blue-600 text-white text-xl rounded-md"
        >
          Về trang chủ
        </Link>
      </div>
      <Helmet>
        <title>Không tìm thấy trang</title>
      </Helmet>
    </div>
  );
};

export default NotFound;
