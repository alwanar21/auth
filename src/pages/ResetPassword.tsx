import { z } from "zod";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { ResetPasswordVerification, ResetPassword as UserResetPassword } from "../services/auth-service";
import { Button, Card, CardBody, CardHeader, Input, Link } from "@nextui-org/react";
import { resetPasswordValidation } from "../validation/auth-validation";
import { formatErrors } from "../utils/format-errors";

type ResetPasswordType = z.infer<typeof resetPasswordValidation>;

export default function ResetPassword() {
  const navigate = useNavigate();
  const [isVisibleNewPassword, setIsVisiblePassword] = useState(false);
  const [isVisibleConfirmPassword, setIsVisibleConfirmPassword] = useState(false);
  const { token } = useParams();

  const toggleVisibilityPassword = () => setIsVisiblePassword(!isVisibleNewPassword);
  const toggleVisibilityConfirmPassword = () => setIsVisibleConfirmPassword(!isVisibleConfirmPassword);

  const ResetPasswordValidationQuery = useQuery({
    queryKey: ["reset-password"],
    queryFn: () => ResetPasswordVerification(token as string),
    retry: false,
    gcTime: 0,
  });

  const resetPasswordMutation = useMutation({
    mutationFn: UserResetPassword,
    onSuccess: (data) => {
      toast.success(data?.data?.message);
      reset();
      navigate("/", { replace: true });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (Array.isArray(error.response?.data?.message)) {
          const formattedErrors = formatErrors(error.response?.data?.message);
          setError("password", formattedErrors?.password);
          setError("confirmPassword", formattedErrors?.confirmPassword);
        } else {
          const errorMessage = error.response?.data?.message || "An unknown error occurred";
          toast.error(errorMessage);
          navigate("/", { replace: true });
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
  } = useForm<ResetPasswordType>({
    resolver: zodResolver(resetPasswordValidation),
  });
  const onSubmit: SubmitHandler<ResetPasswordType> = (data) => {
    const body = {
      ...data,
      token: token,
    };
    resetPasswordMutation.mutate(body);
  };

  useEffect(() => {
    if (ResetPasswordValidationQuery.error instanceof AxiosError) {
      toast.error(ResetPasswordValidationQuery.error.response?.data.message);
      navigate("/");
    }
  }, [ResetPasswordValidationQuery.error, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      {ResetPasswordValidationQuery.isLoading && (
        <>
          <div className="h-screen bg-white">
            <div className="flex justify-center items-center h-full">
              <img
                className="h-16 w-16"
                src="https://icons8.com/preloaders/preloaders/1488/Iphone-spinner-2.gif"
                alt=""
              />
            </div>
          </div>
        </>
      )}
      {ResetPasswordValidationQuery.isFetched && (
        <Card isBlurred className="border-none bg-background/60 max-w-[420px] w-full" shadow="none">
          <CardHeader className=" mx-auto flex items-center justify-center text-2xl font-semibold">
            Change Password
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <Input
                label="Password"
                {...register("password")}
                placeholder="***********"
                variant="bordered"
                isInvalid={!!errors?.password?.message}
                errorMessage={errors?.password?.message}
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
                isDisabled={resetPasswordMutation.isPending}
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
                  isDisabled={resetPasswordMutation.isPending}
                  isRequired
                />
                <div className="flex flex-row justify-between mt-1">
                  <Link
                    underline="hover"
                    className="cursor-pointer text-xs"
                    onClick={() => navigate("/")}
                    isDisabled={resetPasswordMutation.isPending}
                  >
                    Back to home
                  </Link>
                </div>
              </div>
              <Button color="primary" type="submit" fullWidth isLoading={resetPasswordMutation.isPending}>
                Submit
              </Button>
            </form>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
