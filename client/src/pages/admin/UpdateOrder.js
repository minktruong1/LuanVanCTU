import React, { useEffect } from "react";
import { MdArrowBackIosNew } from "react-icons/md";
import { formatVND } from "../../ultils/helpers";
import { AdminSelector, Button, ReactInputForm } from "../../components";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { apiUpdateOrderStatus } from "../../apis";
import { PiExportBold } from "react-icons/pi";
import jsPDF from "jspdf";
import "../../assets/OpenSans-Regular.ttf";

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

  const handleUpdateOrder = async (data) => {
    const response = await apiUpdateOrderStatus(editOrderTab?._id, {
      status: data.status,
    });
    if (response.success) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    // Nhúng font vào tài liệu PDF
    doc.addFileToVFS("OpenSans-Regular.ttf", "[base64 encoding of font]");
    doc.addFont("OpenSans-Regular.ttf", "custom", "normal");
    doc.setFont("custom");
    doc.setFontSize(12);
    doc.text(`Chi tiết đơn hàng ${editOrderTab._id}`, 10, 10);

    // Add order details
    doc.setFontSize(12);
    doc.text(
      `Tên người nhận: ${editOrderTab.buyer.firstName} ${editOrderTab.buyer?.lastName}`,
      10,
      20
    );
    doc.text(`Địa chỉ: ${editOrderTab?.address}`, 10, 30);
    doc.text(`Số điện thoại: ${editOrderTab.buyer?.mobile}`, 10, 40);

    // Add product list
    let y = 50;
    doc.text("Sản phẩm     Đơn giá     Số lượng     Thành tiền", 10, y);
    y += 10;
    editOrderTab?.productList?.forEach((element) => {
      doc.text(
        `${element.title}     ${formatVND(element.price)}đ     ${
          element.quantity
        }     ${formatVND(element.price * element.quantity)}đ`,
        10,
        y
      );
      y += 10;
    });

    // Add total price
    y += 10;
    doc.text(`Tổng tiền: ${formatVND(editOrderTab?.totalPrice)}đ`, 10, y);

    doc.save(`order_${editOrderTab._id}.pdf`);
  };

  useEffect(() => {
    reset({
      status: editOrderTab?.status || "",
    });
  }, []);

  return (
    <div className="w-full p-4">
      <div className="mt-[60px] text-lg">
        <span
          onClick={() => setEditOrderTab(null)}
          className="underline text-canClick flex items-center cursor-pointer"
        >
          <MdArrowBackIosNew />
          Trở về
        </span>
      </div>
      <div className="w-full bg-white rounded p-4">
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

          <div className="grid grid-rows-1">
            <div className="grid grid-cols-10 my-6 font-semibold">
              <div className="col-span-4">
                <span>Sản phẩm</span>
              </div>
              <div className="col-span-2 flex justify-center">
                <span>Đơn giá</span>
              </div>
              <div className="col-span-2 flex justify-center">
                <span>Số lượng</span>
              </div>
              <div className="col-span-2 flex justify-end">
                <span>Thành tiền</span>
              </div>
            </div>

            {editOrderTab?.productList?.map((element) => (
              <div className="grid grid-cols-10">
                <div className="col-span-4 flex ">
                  <span>{element.title}</span>
                </div>
                <div className="col-span-2 flex justify-center">
                  <span>{`${formatVND(element.price)}`}đ</span>
                </div>
                <div className="col-span-2 flex justify-center">
                  <span>{element.quantity}</span>
                </div>
                <div className="col-span-2 flex justify-end">
                  <span>
                    {`${formatVND(element.price * element.quantity)}đ`}
                  </span>
                </div>
              </div>
            ))}
            <div className="grid grid-cols-10 my-6 font-semibold">
              <div className="col-span-4">
                <span></span>
              </div>
              <div className="col-span-2 flex justify-center">
                <span></span>
              </div>
              <div className="col-span-2 flex justify-center">
                <span></span>
              </div>
              <div className="col-span-2 flex justify-end">
                <span>
                  Tổng tiền:
                  {`${formatVND(editOrderTab?.totalPrice)}đ`}
                </span>
              </div>
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
            className="p-2 bg-green-500 flex justify-center items-center cursor-pointer"
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
