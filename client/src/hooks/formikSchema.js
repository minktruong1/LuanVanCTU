import * as yup from "yup";

const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
//Ít nhất 8 ký tự, 1 viết in, 1 số
const regexPhoneNumber = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Hãy nhập đúng email của bạn")
    .required("Không được để trống"),

  password: yup
    .string()
    .min(8, "Mật khẩu phải ít nhất 8 ký tự")
    .required("Không được để trống"),
});

export const registerSchema = yup.object().shape({
  firstName: yup.string().required("Không được để trống"),
  lastName: yup.string().required("Không được để trống"),
  email: yup
    .string()
    .email("Hãy nhập email của bạn")
    .required("Không được để trống"),
  mobile: yup
    .string()
    .matches(regexPhoneNumber, { message: "Sai định dạng số điện thoại" })
    .required("Không được để trống"),
  password: yup
    .string()
    .min(8, "Mật khẩu phải ít nhất 8 ký tự")
    .matches(passwordRules, {
      message: "Mật khẩu phải trên 8 kí tự và có viết in kèm 1 số",
    })
    .required("Không được để trống"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Mật khẩu chưa trùng nhau")
    .required("Không được để trống"),
});

export const forgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .email("Hãy nhập đúng email của bạn")
    .required("Không được để trống"),
});

export const resetPasswordSchema = yup.object().shape({
  password: yup
    .string()
    .min(8, "Mật khẩu phải ít nhất 8 ký tự")
    .matches(passwordRules, {
      message: "Mật khẩu phải trên 8 kí tự và có viết in kèm 1 số",
    })
    .required("Không được để trống"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Mật khẩu chưa trùng nhau")
    .required("Không được để trống"),
});
