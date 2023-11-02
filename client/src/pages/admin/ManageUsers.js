import React, { useCallback, useEffect, useState } from "react";
import { apiGetUserList, apiUpdateUser, apiDeleteUser } from "../../apis/user";
import moment from "moment";
import {
  InputField,
  ReactInputForm,
  Pagination,
  Select,
  Button,
  AdminSelector,
} from "../../components";
import useDebounce from "../../hooks/useDebounce";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import clsx from "clsx";
import { toast } from "react-toastify";
import sweetAlert from "sweetalert2";
import { userRole, userStatus } from "../../ultils/contants";

const ManageUsers = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm({
    email: "",
    firstName: "",
    lastName: "",
    role: "",
    mobile: "",
    isBlocked: "",
  });

  const [users, setUsers] = useState(null);
  const [queries, setQueries] = useState({
    queryCollect: "",
  });
  const [editUser, setEditUser] = useState(null);
  const [update, setUpdate] = useState(false);
  const [params] = useSearchParams();

  const fetchUserList = async (params) => {
    const response = await apiGetUserList({ ...params, limit: 10 });
    if (response.success) {
      setUsers(response);
    }
  };

  const reRender = useCallback(() => {
    setUpdate(!update);
  }, [update]);

  const queriesDebounce = useDebounce(queries.queryCollect, 600);

  useEffect(() => {
    const queries = Object.fromEntries([...params]);
    if (queriesDebounce) {
      queries.queryCollect = queriesDebounce;
    }
    fetchUserList(queries);
  }, [queriesDebounce, params, update]);

  const handleUpdate = async (data) => {
    const response = await apiUpdateUser(data, editUser._id);
    if (response.success) {
      setEditUser(null);
      reRender();
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
  };

  const handleDelete = (uid) => {
    sweetAlert
      .fire({
        title: "Xác nhận",
        text: "Bạn chắc chắn muốn xóa người này?",
        showCancelButton: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          const response = await apiDeleteUser(uid);
          if (response.success) {
            reRender();
            toast.success(response.message);
          } else toast.error(response.message);
        }
      });
  };

  useEffect(() => {
    if (editUser)
      reset({
        email: editUser.email,
        firstName: editUser.firstName,
        lastName: editUser.lastName,
        role: editUser.role,
        mobile: editUser.mobile,
        isBlocked: editUser.isBlocked,
      });
  }, [editUser]);

  // console.log(editUser);
  return (
    <div className="w-full ">
      <div className="h-[75px] flex justify-between items-center text-2xl font-bold px-4 border-b mt-[60px]">
        <h1>Manage Users</h1>
      </div>
      <div className="w-full p-4">
        <div className="flex py-4">
          <InputField
            nameKey={"queryCollect"}
            value={queries.queryCollect}
            setValue={setQueries}
            style={"w30"}
            placeholder="Search..."
            isShowLabel={true}
          />
        </div>
        <form onSubmit={handleSubmit(handleUpdate)}>
          <table className="table-auto mb-6 text-left w-full">
            <thead className="font-semibold bg-gray-300 ">
              <tr className="border">
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Địa chỉ email</th>
                <th className="px-4 py-2">Họ</th>
                <th className="px-4 py-2">Tên</th>
                <th className="px-4 py-2">Vai trò</th>
                <th className="px-4 py-2">SĐT</th>
                <th className="px-4 py-2">Trạng thái</th>
                <th className="px-4 py-2">Ngày đăng ký</th>
                <th className="px-4 py-2">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {users?.userList?.map((element, index) => (
                <>
                  <tr
                    key={element._id}
                    className={clsx("", index % 2 === 1 && "bg-[#fff]")}
                  >
                    <td className="py-2 px-4">{index + 1}</td>
                    <td className="py-2 px-4">
                      <span>{element.email}</span>
                    </td>
                    <td className="py-2 px-4">
                      <span>{element.firstName}</span>
                    </td>
                    <td className="py-2 px-4">
                      <span>{element.lastName}</span>
                    </td>
                    <td className="py-2 px-4">
                      <span>{element.role}</span>
                    </td>
                    <td className="py-2 px-4">
                      <span>{element.mobile}</span>
                    </td>
                    <td className="py-2 px-4">
                      <span>{element.isBlocked ? "Blocked" : "Active"}</span>
                    </td>
                    <td className="py-2 px-4">
                      {moment(element.createdAt).format("DD/MM/YYYY")}
                    </td>
                    <td className="py-2 px-4 ">
                      <span
                        onClick={() => setEditUser(element)}
                        className="underline cursor-pointer mr-2 text-canClick"
                      >
                        Sửa
                      </span>
                      <span
                        onClick={() => handleDelete(element._id)}
                        className="underline cursor-pointer text-canClick"
                      >
                        Xóa
                      </span>
                    </td>
                  </tr>
                  {editUser?._id === element?._id && (
                    <>
                      <tr key={element._id} className="border-l border-r ">
                        <td className="py-2 px-2"></td>
                        <td className="py-2 px-2">
                          <span>
                            <ReactInputForm
                              register={register}
                              errors={errors}
                              id={"email"}
                              validate={{
                                required: "Vui lòng nhập",
                                pattern: {
                                  value:
                                    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                  message: "Email không hợp lệ",
                                },
                              }}
                              defaultValue={editUser?.email}
                              fullWidth
                            />
                          </span>
                        </td>
                        <td className="py-2 px-2">
                          <span>
                            <ReactInputForm
                              register={register}
                              errors={errors}
                              id={"firstName"}
                              validate={{ required: "Vui lòng nhập" }}
                              defaultValue={editUser?.firstName}
                              fullWidth
                            />
                          </span>
                        </td>
                        <td className="py-2 px-2">
                          <span>
                            <ReactInputForm
                              register={register}
                              errors={errors}
                              id={"lastName"}
                              validate={{ required: "Vui lòng nhập" }}
                              defaultValue={editUser?.lastName}
                              fullWidth
                            />
                          </span>
                        </td>
                        <td className="py-2 px-2">
                          <span>
                            <AdminSelector
                              register={register}
                              errors={errors}
                              id={"role"}
                              validate={{ required: "Vui lòng nhập" }}
                              defaultValue={element.role}
                              options={userRole}
                              fullWidth
                            />
                          </span>
                        </td>
                        <td className="py-2 px-2">
                          <span>
                            <ReactInputForm
                              register={register}
                              errors={errors}
                              id={"mobile"}
                              validate={{
                                required: "Vui lòng nhập",
                                pattern: {
                                  value: /^[62|0]+\d{9}/gi,
                                  message: "sđt không hợp lệ",
                                },
                              }}
                              defaultValue={editUser?.mobile}
                              fullWidth
                            />
                          </span>
                        </td>
                        <td className="py-2 px-2">
                          <AdminSelector
                            register={register}
                            errors={errors}
                            id={"isBlocked"}
                            validate={{ required: "Vui lòng nhập" }}
                            defaultValue={element.isBlocked}
                            options={userStatus}
                            fullWidth
                          />
                        </td>
                        <td className="py-2 px-2">
                          {moment(element.createdAt).format("DD/MM/YYYY")}
                        </td>
                      </tr>
                      <tr className="border border-t-0">
                        <td></td>
                        <td className="">
                          <span
                            onClick={() => setEditUser(null)}
                            className="mr-[16px] underline text-canClick cursor-pointer"
                          >
                            Trở về
                          </span>
                          {editUser && <Button type="submit">Update</Button>}
                        </td>
                      </tr>
                    </>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </form>

        <div className="w-full flex justify-center">
          <Pagination totalCount={users?.counts} />
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
