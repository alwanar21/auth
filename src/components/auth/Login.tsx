import { z } from "zod";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { AxiosError } from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatErrors } from "../../utils/format-errors";
import { SubmitHandler, useForm } from "react-hook-form";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Login as UserLogin } from "../../services/auth-service";
import { loginUserValidation } from "../../validation/auth-validation";
import { Button, Card, CardBody, CardHeader, Input, Link } from "@nextui-org/react";
import { setAccessTokenCookies, setRefreshTokenCookies } from "../../utils/cookies";

type FormProps = {
  setForm: React.Dispatch<React.SetStateAction<"login" | "register" | "forgotPassword" | "email verification">>;
};

type LoginUserType = z.infer<typeof loginUserValidation>;

export default function Login({ setForm }: FormProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toggleVisibility = () => setIsVisible(!isVisible);

  useEffect(() => {
    const message = searchParams.get("message");

    if (message) {
      const timeoutToast = setTimeout(() => {
        toast.success(message);
      }, 1000);
      const navigateTimeout = setTimeout(() => {
        navigate("/");
      }, 1500);

      return () => {
        clearTimeout(timeoutToast);
        clearTimeout(navigateTimeout);
      };
    }
  }, [navigate, searchParams]);

  const loginMutation = useMutation({
    mutationFn: UserLogin,
    onSuccess: (data) => {
      setAccessTokenCookies(data.data.accessToken);
      setRefreshTokenCookies(data.data.refreshToken);
      Cookies.set("isAuthenticated", "true");
      navigate("/dashboard", { replace: true });
      toast.success(`Welcome, ${data?.data?.data.username}!`);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (Array.isArray(error.response?.data?.message)) {
          const formattedErrors = formatErrors(error.response?.data?.message);
          setError("email", formattedErrors?.email);
          setError("password", formattedErrors?.password);
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
    formState: { errors },
  } = useForm<LoginUserType>({
    resolver: zodResolver(loginUserValidation),
  });
  const onSubmit: SubmitHandler<LoginUserType> = (data) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card isBlurred className="border-none bg-background/60 max-w-[420px] w-full" shadow="none">
        <CardHeader className=" mx-auto flex items-center justify-center text-2xl font-semibold">Login</CardHeader>
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
              isDisabled={loginMutation.isPending}
              isRequired
            />
            <div>
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
                    onClick={toggleVisibility}
                    aria-label="toggle password visibility"
                  >
                    {isVisible ? <AiFillEyeInvisible /> : <AiFillEye />}
                  </button>
                }
                type={isVisible ? "text" : "password"}
                isDisabled={loginMutation.isPending}
                isRequired
              />
              <div className="flex flex-row justify-between mt-1">
                <Link
                  underline="hover"
                  className="cursor-pointer text-xs"
                  onClick={() => setForm("register")}
                  isDisabled={loginMutation.isPending}
                >
                  Don't have an account?
                </Link>
                <Link
                  underline="hover"
                  className="cursor-pointer text-xs"
                  onClick={() => setForm("email verification")}
                  isDisabled={loginMutation.isPending}
                >
                  Verify your email
                </Link>
              </div>
              <div className="flex flex-row justify-between mt-1">
                <Link
                  underline="hover"
                  className="cursor-pointer text-xs"
                  onClick={() => setForm("forgotPassword")}
                  isDisabled={loginMutation.isPending}
                >
                  Forgot password
                </Link>
              </div>
            </div>
            <Button color="primary" type="submit" fullWidth isLoading={loginMutation.isPending}>
              Submit
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
