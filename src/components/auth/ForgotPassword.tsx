import { z } from "zod";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatErrors } from "../../utils/format-errors";
import { SubmitHandler, useForm } from "react-hook-form";
import { forgotPasswordValidation } from "../../validation/auth-validation";
import { Button, Card, CardBody, CardHeader, Input, Link } from "@nextui-org/react";
import { ForgotPassword as UserForgotPassword } from "../../services/auth-service";

type FormProps = {
  setForm: React.Dispatch<React.SetStateAction<"login" | "register" | "forgotPassword" | "email verification">>;
};

type ForgotPasswordType = z.infer<typeof forgotPasswordValidation>;

export default function ForgotPassword({ setForm }: FormProps) {
  const forgotPasswordMutation = useMutation({
    mutationFn: UserForgotPassword,
    onSuccess: (data) => {
      toast.success(`Welcome, ${data?.data?.data.username}!`);
      reset();
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (Array.isArray(error.response?.data?.message)) {
          const formattedErrors = formatErrors(error.response?.data?.message);
          setError("email", formattedErrors?.email);
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
    reset,
    setError,
    formState: { errors },
  } = useForm<ForgotPasswordType>({
    resolver: zodResolver(forgotPasswordValidation),
  });
  const onSubmit: SubmitHandler<ForgotPasswordType> = (data) => {
    forgotPasswordMutation.mutate(data);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card isBlurred className="border-none bg-background/60 max-w-[420px] w-full" shadow="none">
        <CardHeader className=" mx-auto flex items-center justify-center text-2xl font-semibold">
          Forgot Password
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div>
              <Input
                type="email"
                label="Email"
                {...register("email")}
                placeholder="example@email.com"
                variant="bordered"
                isInvalid={!!errors?.email?.message}
                errorMessage={errors?.email?.message}
                isRequired
              />
              <Link underline="hover" className="cursor-pointer text-xs" onClick={() => setForm("login")}>
                Back to Login
              </Link>
            </div>
            <Button color="primary" type="submit" fullWidth>
              Submit
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
