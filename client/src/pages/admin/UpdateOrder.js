import React, { useEffect, useState } from "react";
import { MdArrowBackIosNew } from "react-icons/md";
import { formatVND } from "../../ultils/helpers";
import { AdminSelector, Button, Loading } from "../../components";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { apiUpdateOrderStatus } from "../../apis";
import { PiExportBold } from "react-icons/pi";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useDispatch } from "react-redux";
import { showModal } from "../../store/app/appSlice";

const status = [
  { id: 1, text: "Đang xử lý", value: "Đang xử lý" },
  { id: 2, text: "Vận chuyển", value: "Đang vận chuyển" },
  { id: 3, text: "Hủy", value: "Hủy" },
  { id: 4, text: "Hoàn thành", value: "Hoàn thành" },
];

const UpdateOrder = ({ editOrderTab, setEditOrderTab }) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();
  const dispatch = useDispatch();
  const [isDone, setIsDone] = useState(false);

  const handleUpdateOrder = async (data) => {
    dispatch(showModal({ isShowModal: true, modalContent: <Loading /> }));
    const response = await apiUpdateOrderStatus(editOrderTab?._id, {
      status: data.status,
    });
    dispatch(showModal({ isShowModal: false, modalContent: null }));

    if (response.success) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
  };

  const handleExportPDF = () => {
    const input = document.getElementById("canvas");
    html2canvas(input, {
      loggin: true,
      letterRendering: 1,
      useCORS: true,
    }).then(function (canvas) {
      const imgWidth = 220;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const imgData = canvas.toDataURL("img/png");
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(imgData, "PNG", 2, 20, imgWidth, imgHeight);
      pdf.save(`Hóa đơn ${editOrderTab._id}`);
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (editOrderTab.status === "Hoàn thành") {
      setIsDone(true);
    }
    reset({
      status: editOrderTab?.status || "",
    });
  }, []);

  return (
    <div className="w-[1200px] md:w-full p-4 overflow-auto">
      <div className="mt-[60px] text-lg">
        <span
          onClick={() => setEditOrderTab(null)}
          className="underline text-canClick flex w-fit items-center cursor-pointer"
        >
          <MdArrowBackIosNew />
          Trở về
        </span>
      </div>
      <div id="canvas" className="w-full bg-white rounded p-4">
        <div className="grid grid-rows-1">
          <h1 className="text-xl font-medium">
            Chi tiết đơn hàng {editOrderTab._id}
          </h1>
          <div className="grid grid-cols-8">
            <span className="col-span-1 text-[#6d6e72]">Tên người nhận:</span>
            <span className="col-span-7 font-semibold">{`${editOrderTab.buyer.firstName} ${editOrderTab.buyer?.lastName}`}</span>
          </div>
          <div className="grid grid-cols-8">
            <span className="col-span-1 text-[#6d6e72]">Địa chỉ:</span>
            <span className="col-span-7 font-semibold">
              <span>{editOrderTab?.address}</span>
            </span>
          </div>
          <div className="grid grid-cols-8">
            <span className="col-span-1 text-[#6d6e72]">Số điện thoại:</span>
            <span className="col-span-7 font-semibold">
              {editOrderTab.buyer?.mobile}
            </span>
          </div>
          <div className="grid grid-cols-8">
            <span className="col-span-1 text-[#6d6e72]">Lời nhắn:</span>
            <span className="col-span-7 font-semibold">
              {editOrderTab?.note || <span></span>}
            </span>
          </div>

          <div className="grid grid-rows-1">
            <div className="grid grid-cols-12 my-6 font-semibold">
              <div className="col-span-4">
                <span>Sản phẩm</span>
              </div>
              <div className="col-span-2 flex justify-center">
                <span>Đơn giá</span>
              </div>
              <div className="col-span-2 flex justify-center">
                <span>Số lượng</span>
              </div>
              <div className="col-span-3 flex justify-end">
                <span>Thành tiền</span>
              </div>
              <div className="col-span-1"></div>
            </div>

            {editOrderTab?.productList?.map((element) => (
              <div className="grid grid-cols-12">
                <div className="col-span-4 flex ">
                  <span>{element.title}</span>
                </div>
                <div className="col-span-2 flex justify-center">
                  <span>{`${formatVND(element.price)}`}đ</span>
                </div>
                <div className="col-span-2 flex justify-center">
                  <span>{element.quantity}</span>
                </div>
                <div className="col-span-3 flex justify-end">
                  <span>
                    {`${formatVND(element.price * element.quantity)}đ`}
                  </span>
                </div>
                <div className="col-span-1"></div>
              </div>
            ))}
            <div className="grid grid-cols-12 my-6 font-semibold">
              <div className="col-span-11">
                <div className="text-right text-lg">
                  <span>
                    {`Phí vận chuyển: ${formatVND(
                      editOrderTab?.shipPrice || 0
                    )}đ`}
                  </span>
                </div>
                <div className="text-right text-lg">
                  <span>
                    {`Tổng tiền: ${formatVND(editOrderTab?.totalPrice)}đ`}
                  </span>
                </div>
                <div className="text-right text-lg">
                  <span>
                    {`Đã giảm: ${formatVND(
                      editOrderTab?.totalPrice -
                        editOrderTab?.lastPrice +
                        editOrderTab?.shipPrice
                    )}đ`}
                  </span>
                </div>
                <div className="text-right text-lg">
                  <span>
                    {`Thanh toán: ${formatVND(editOrderTab?.lastPrice)}đ`}
                  </span>
                </div>
              </div>
              <div className="col-span-1"></div>
            </div>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit(handleUpdateOrder)}>
        <div className="w-full bg-white rounded mt-4 p-4">
          <div className="grid grid-rows-1">
            <AdminSelector
              label="Cập nhật trạng thái"
              options={status?.map((element) => ({
                text: element.text,
                value: element.value,
              }))}
              register={register}
              id="status"
              validate={{ required: "Vui lòng nhập" }}
              errors={errors}
            />
          </div>
        </div>
        <div className="mt-8 flex justify-between items-center">
          <Button type="submit">Lưu</Button>
          <div
            onClick={handleExportPDF}
            className="p-2 bg-green-500 flex justify-center items-center cursor-pointer text-white"
          >
            <PiExportBold />
            <span>Xuất file</span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateOrder;
