import { z } from "zod";
import { PublicInstance } from "./service";
import Cookies from "js-cookie";
import {
  emailVerificationValidation,
  forgotPasswordValidation,
  loginUserValidation,
  registerUserValidation,
  resetPasswordValidation,
} from "../validation/auth-validation";

type LoginType = z.infer<typeof loginUserValidation>;
type RegisterType = z.infer<typeof registerUserValidation>;
type EmailVerificationType = z.infer<typeof emailVerificationValidation>;
type ForgotPasswordType = z.infer<typeof forgotPasswordValidation>;
type ResetPasswordType = z.infer<typeof resetPasswordValidation>;

const Login = async (data: LoginType) => {
  const result = await PublicInstance("/api/login", {
    data,
    method: "post",
  });

  return result;
};

const Register = async (data: RegisterType) => {
  const result = await PublicInstance("/api/register", {
    data,
    method: "post",
  });
  return result;
};

const EmailVerification = async (data: EmailVerificationType) => {
  const result = await PublicInstance("/api/auth/email-verification", {
    data,
    method: "post",
  });
  return result;
};

const ForgotPassword = async (data: ForgotPasswordType) => {
  const result = await PublicInstance("/api/auth/forgot-password", {
    data,
    method: "put",
  });
  return result;
};

const RefreshToken = async () => {
  const refreshToken = Cookies.get("refreshToken");

  const result = await PublicInstance("/api/auth/refresh", {
    method: "post",
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
  });

  return result;
};

const ResetPasswordVerification = async (token: string) => {
  const result = await PublicInstance(`/auth/reset-password/${token}`, {
    method: "get",
  });
  return result;
};

const ResetPassword = async (data: ResetPasswordType) => {
  const result = await PublicInstance("/api/auth/reset-password", {
    data,
    method: "put",
  });
  return result;
};

export { Login, Register, EmailVerification, ForgotPassword, RefreshToken, ResetPasswordVerification, ResetPassword };
