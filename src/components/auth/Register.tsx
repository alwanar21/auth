import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatErrors } from "../../utils/format-errors";
import { SubmitHandler, useForm } from "react-hook-form";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Register as UserRegister } from "../../services/auth-service";
import { registerUserValidation } from "../../validation/auth-validation";
import { Button, Card, CardBody, CardHeader, Input, Link } from "@nextui-org/react";

type FormProps = {
  setForm: React.Dispatch<React.SetStateAction<"login" | "register" | "forgotPassword" | "email verification">>;
};

type RegisterUserType = z.infer<typeof registerUserValidation>;

export default function Register({ setForm }: FormProps) {
  const [isVisiblePassword, setIsVisiblePassword] = useState(false);
  const [isVisibleConfirmPassword, setIsVisibleConfirmPassword] = useState(false);

  const toggleVisibilityPassword = () => setIsVisiblePassword(!isVisiblePassword);
  const toggleVisibilityConfirmPassword = () => setIsVisibleConfirmPassword(!isVisibleConfirmPassword);

  const registerMutation = useMutation({
    mutationFn: UserRegister,
    onSuccess: (data) => {
      toast.success(data?.data?.message);
      setForm("login");
      reset();
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        console.log(Array.isArray(error.response?.data?.message));

        if (Array.isArray(error.response?.data?.message)) {
          const formattedErrors = formatErrors(error.response?.data?.message);
          setError("email", formattedErrors?.email);
          setError("password", formattedErrors?.password);
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
  } = useForm<RegisterUserType>({
    resolver: zodResolver(registerUserValidation),
  });
  const onSubmit: SubmitHandler<RegisterUserType> = (data) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card isBlurred className="border-none bg-background/60 max-w-[420px] w-full" shadow="none">
        <CardHeader className=" mx-auto flex items-center justify-center text-2xl font-semibold">Register</CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input
              type="email"
              label="Email"
              {...register("email")}
              placeholder="example@email.com"
              variant="bordered"
              isInvalid={!!errors?.email?.message}
              errorMessage={errors?.email?.message}
              isDisabled={registerMutation.isPending}
              isRequired
            />
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
                  {isVisiblePassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                </button>
              }
              type={isVisiblePassword ? "text" : "password"}
              isDisabled={registerMutation.isPending}
              isRequired
            />
            <div>
              <Input
                {...register("confirmPassword")}
                label="Confirm Password"
                placeholder="Enter your confirmation password"
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
                isDisabled={registerMutation.isPending}
                isRequired
              />
              <Link underline="hover" className="cursor-pointer text-xs mt-1" onClick={() => setForm("login")}>
                Already have an account?
              </Link>
            </div>
            <Button color="primary" type="submit" fullWidth isLoading={registerMutation.isPending}>
              Submit
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
