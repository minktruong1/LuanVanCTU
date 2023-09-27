import React, { useState } from "react";
import { Button } from "../../components";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { apiResetPassword } from "../../apis";
import { toast } from "react-toastify";
import path from "../../ultils/path";

const RsPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");

  //Define token match with what u define in path
  const { token } = useParams();

  const handleResetPassword = async () => {
    const response = await apiResetPassword({ password, token });

    if (response.success) {
      toast.success(response.message);
    } else {
      toast.info(response.message);
    }
    navigate(`/${path.LOGIN}`);
  };

  return (
    <>
      <div className="flex justify-center ">
        <div className="flex bg-white justify-center p-8 min-w-[544px] w-1/2 mt-[30px] mb-[30px]">
          <div className="w-[80%] ">
            <div className="flex flex-col gap-4">
              <label htmlFor="email">Hãy nhập mật khẩu mới của bạn:</label>
              <input
                type="password"
                className="px-4 py-2 border w-full my-2 outline-none"
                placeholder="Mật khẩu mới"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="flex items-center justify-center w-full">
                <Button
                  name="Gửi yêu cầu"
                  handleOnClick={handleResetPassword}
                  wFull
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RsPassword;
