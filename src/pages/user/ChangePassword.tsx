import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatErrors } from "../../utils/format-errors";
import { SubmitHandler, useForm } from "react-hook-form";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { ChangePassword as UserChangePassword } from "../../services/profile-service";
import { Button, Card, CardBody, CardHeader, Input, Link } from "@nextui-org/react";
import { updatePasswordValidation } from "../../validation/profile-validation";

type UpdatePasswordType = z.infer<typeof updatePasswordValidation>;

export default function ChangePassword() {
  const navigate = useNavigate();
  const [isVisibleNewPassword, setIsVisiblePassword] = useState(false);
  const [isVisibleConfirmPassword, setIsVisibleConfirmPassword] = useState(false);

  const toggleVisibilityPassword = () => setIsVisiblePassword(!isVisibleNewPassword);
  const toggleVisibilityConfirmPassword = () => setIsVisibleConfirmPassword(!isVisibleConfirmPassword);

  const changePasswordMutation = useMutation({
    mutationFn: UserChangePassword,
    onSuccess: (data) => {
      toast.success(data?.data?.message);
      reset();
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 3000);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (Array.isArray(error.response?.data?.message)) {
          const formattedErrors = formatErrors(error.response?.data?.message);
          setError("currentPassword", formattedErrors?.currentPassword);
          setError("newPassword", formattedErrors?.newPassword);
          setError("confirmPassword", formattedErrors?.confirmPassword);
        } else {
          const errorMessage = error.response?.data?.message || "An unknown error occurred";
          toast.error(errorMessage);
        }
      } else {
        console.log(error.message);
      }
    },
  });

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<UpdatePasswordType>({
    resolver: zodResolver(updatePasswordValidation),
  });
  const onSubmit: SubmitHandler<UpdatePasswordType> = (data) => {
    changePasswordMutation.mutate(data);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card isBlurred className="border-none bg-background/60 max-w-[420px] w-full" shadow="none">
        <CardHeader className=" mx-auto flex items-center justify-center text-2xl font-semibold">
          Change Password
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input
              label="Current Password"
              {...register("currentPassword")}
              placeholder="type your current password"
              variant="bordered"
              isInvalid={!!errors?.currentPassword?.message}
              errorMessage={errors?.currentPassword?.message}
              type="text"
              isDisabled={changePasswordMutation.isPending}
              isRequired
            />
            <Input
              label="New Password"
              {...register("newPassword")}
              placeholder="***********"
              variant="bordered"
              isInvalid={!!errors?.newPassword?.message}
              errorMessage={errors?.newPassword?.message}
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleVisibilityPassword}
                  aria-label="toggle password visibility"
                >
                  {isVisibleNewPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                </button>
              }
              type={isVisibleNewPassword ? "text" : "password"}
              isDisabled={changePasswordMutation.isPending}
              isRequired
            />
            <div>
              <Input
                {...register("confirmPassword")}
                label="Confirm Password"
                placeholder="*********"
                variant="bordered"
                isInvalid={!!errors?.confirmPassword?.message}
                errorMessage={errors?.confirmPassword?.message}
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={toggleVisibilityConfirmPassword}
                    aria-label="toggle password visibility"
                  >
                    {isVisibleConfirmPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                  </button>
                }
                type={isVisibleConfirmPassword ? "text" : "password"}
                isDisabled={changePasswordMutation.isPending}
                isRequired
              />
              <div className="flex flex-row justify-between mt-1">
                <Link
                  underline="hover"
                  className="cursor-pointer text-xs"
                  onClick={() => navigate("/dashboard")}
                  isDisabled={changePasswordMutation.isPending}
                >
                  Back to dashboard
                </Link>
              </div>
            </div>
            <Button color="primary" type="submit" fullWidth isLoading={changePasswordMutation.isPending}>
              Submit
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
