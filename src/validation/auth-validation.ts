import { z } from "zod";

const registerUserValidation = z
  .object({
    email: z
      .string({ message: "Email must be a string" })
      .min(1, { message: "Email is required" })
      .email({ message: "Email must be a valid email format" }),

    password: z
      .string({ message: "Password must be a string" })
      .min(1, { message: "Password is required" })
      .regex(/^(?=.*[A-Z])(?=.*\W).{7,}$/, {
        message:
          "Password must contain at least one uppercase letter, one special character, and be at least 7 characters long",
      }),

    confirmPassword: z.string().min(1, { message: "Confirm Password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Confirm Password must match with password",
  });

const loginUserValidation = z.object({
  email: z
    .string({ message: "Email must be a string" })
    .min(1, { message: "Email is required" })
    .email({ message: "Email must be a valid email format" }),
  password: z.string({ message: "Password must be a string" }),
});

const forgotPasswordValidation = z.object({
  email: z
    .string({ message: "Email must be a string" })
    .min(1, { message: "Email is required" })
    .email({ message: "Email must be a valid email format" }),
});

const emailVerificationValidation = z.object({
  email: z
    .string({ message: "Email must be a string" })
    .min(1, { message: "Email is required" })
    .email({ message: "Email must be a valid email format" }),
});

const resetPasswordValidation = z
  .object({
    password: z
      .string({ message: "Password must be a string" })
      .min(1, { message: "Password is required" })
      .regex(/^(?=.*[A-Z])(?=.*\W).{7,}$/, {
        message:
          "Password must contain at least one uppercase letter, one special character, and be at least 7 characters long",
      }),

    confirmPassword: z.string().min(1, { message: "Confirm Password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Confirm Password must match with password",
  });

export {
  registerUserValidation,
  loginUserValidation,
  forgotPasswordValidation,
  emailVerificationValidation,
  resetPasswordValidation,
};
