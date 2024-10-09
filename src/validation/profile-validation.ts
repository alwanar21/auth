import { z } from "zod";

const updatePasswordValidation = z
  .object({
    currentPassword: z
      .string({ message: "Current password must be a string" })
      .min(1, { message: "Current password is required" })
      .email({ message: "Email must be a valid email format" }),

    newPassword: z
      .string({ message: "New password must be a string" })
      .min(1, { message: "New password is required" })
      .regex(/^(?=.*[A-Z])(?=.*\W).{7,}$/, {
        message:
          "Password must contain at least one uppercase letter, one special character, and be at least 7 characters long",
      }),

    confirmPassword: z.string().min(1, { message: "Confirm password is required" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Confirm Password must match with new password",
  });

const updateProfileValidation = z.object({
  username: z
    .string({ message: "Username must be a string" })
    .min(1, { message: "Username must be a string" })
    .regex(/^(?![_.])[a-zA-Z0-9._]{3,10}(?<![_.])$/, {
      message:
        "Username must be 3-10 characters, can contain uppercase or lowercase letters, numbers, periods, and underscores, and cannot start, end, or have consecutive periods or underscores.",
    }),

  birthDate: z
    .string()
    .min(1, { message: "Birth date is required" }) // Checks for non-empty string
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Birth Date must be a valid Date",
    })
    .transform((date) => new Date(date)),
});

export { updatePasswordValidation, updateProfileValidation };
