import React from "react";
import { Helmet } from "react-helmet";
import { Breadcrumb } from "../../components";

const paymentContent = [
  {
    id: 1,
    title: "Thanh toán khi nhận hàng",
    description:
      "Khi quý khách hàng nhận hàng sẽ thanh toán tổng giá trị đơn hàng hoặc phần còn lại (sau khi khách hàng đã đặt cọc trước) bằng tiền mặt hoặc quẹt thẻ (chỉ áp dụng đơn hàng ở nội thành Tp. Hồ Chí Minh và Hà Nội). Quý khách sẽ thanh toán tại địa điểm nhận hàng cho nhân viên giao nhận của Cửa hàng hoặc đơn vị vận chuyển mà Cửa hàng sử dụng.",
  },
  {
    id: 2,
    title: "Thanh toán qua paypal",
    description:
      "Bước 1: Sau khi chọn hình thức thanh toán qua PAYPAL, hệ thống sẽ chuyển sang giao diện thanh toán của MOMO. Bước 2: Nhập thông tin thẻ, kiểm tra số tiền cần thanh toán và xác nhận thanh toán.",
  },
  {
    id: 3,
    title: "Thanh toán qua VNpay",
    description:
      "Bước 1: Sau khi chọn hình thức thanh toán qua VNPAY, hệ thống sẽ chuyển sang giao diện thanh toán của MOMO. Bước 2: Chọn ngân hàng của bạn, nhập thông tin thẻ, kiểm tra số tiền cần thanh toán và xác nhận thanh toán.",
  },
];

const PaymentInstruction = () => {
  return (
    <div className="w-[calc(100%-20px)] md:w-main">
      <Breadcrumb />
      <div className="bg-white rounded p-6">
        <div className="flex justify-center text-2xl mb-4">
          Thông tin hướng dẫn thanh toán
        </div>
        {paymentContent?.map((element) => (
          <div className="grid grid-rows-1" key={element.id}>
            <span className="text-xl font-bold">{element.title}</span>
            <span>{element.description}</span>
          </div>
        ))}
      </div>
      <Helmet>
        <title>Hướng dẫn thanh toán</title>
      </Helmet>
    </div>
  );
};

export default PaymentInstruction;
