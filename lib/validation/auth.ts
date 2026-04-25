import * as yup from "yup";

const bdPhoneRegex = /^01[3-9]\d{8}$/;

export const signupSchema = yup.object({
  name: yup.string().required(),
  phone: yup
    .string()
    .matches(bdPhoneRegex, "Invalid BD Phone number")
    .required(),
  password: yup.string().min(6).required(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match"),
});

export const loginSchema = yup.object({
  phone: yup
    .string()
    .matches(bdPhoneRegex, "Invalid BD Phone number")
    .required(),
  password: yup.string().required(),
});
