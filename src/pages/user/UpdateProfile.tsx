import { z } from "zod";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatErrors } from "../../utils/format-errors";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { UpdateProfile as UserUpdateProfile } from "../../services/profile-service";
import { Button, Card, CardBody, CardHeader, DatePicker, Input, Link } from "@nextui-org/react";
import { updateProfileValidation } from "../../validation/profile-validation";
import { CalendarDate, parseDate } from "@internationalized/date";
import useAuthStore from "../../store/auth-store";
import moment from "moment";

type UpdateprofileType = z.infer<typeof updateProfileValidation>;

export default function UpdateProfile() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  console.log(user);

  const {
    handleSubmit,
    register,
    setError,
    control,
    formState: { errors },
  } = useForm<UpdateprofileType>({
    resolver: zodResolver(updateProfileValidation),
    defaultValues: {
      username: user?.username,
      birthDate: user?.birthDate ? new Date(user?.birthDate) : undefined,
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: UserUpdateProfile,
    onSuccess: (data) => {
      useAuthStore.getState().changeUser({
        username: data.data.data.username,
        birthDate: data.data.data.birthDate,
      });
      navigate("/dashboard", { replace: true });
      toast.success(data?.data?.message);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (Array.isArray(error.response?.data?.message)) {
          const formattedErrors = formatErrors(error.response?.data?.message);
          setError("username", formattedErrors?.username);
          setError("birthDate", formattedErrors?.birthDate);
        } else {
          const errorMessage = error.response?.data?.message || "An unknown error occurred";
          toast.error(errorMessage);
        }
      } else {
        console.error(error);
      }
    },
  });

  const onSubmit: SubmitHandler<UpdateprofileType> = (data) => {
    console.log(data, "data");
    updateProfileMutation.mutate(data);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card isBlurred className="border-none bg-background/60 max-w-[420px] w-full" shadow="none">
        <CardHeader className="mx-auto flex items-center justify-center text-2xl font-semibold">
          Update Profile
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input
              label="Username"
              {...register("username")}
              placeholder="type your username"
              defaultValue={user?.username}
              variant="bordered"
              isInvalid={!!errors?.username?.message}
              errorMessage={errors?.username?.message}
              type="text"
              isDisabled={updateProfileMutation.isPending}
              isRequired
            />

            <Controller
              name="birthDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  label="Birth date"
                  defaultValue={parseDate(moment(user?.birthDate).format("YYYY-MM-DD"))}
                  onChange={(date: CalendarDate) => field.onChange(date.toDate("UTC"))}
                  variant="bordered"
                  isInvalid={!!errors?.birthDate?.message}
                  errorMessage={errors?.birthDate?.message}
                  isDisabled={updateProfileMutation.isPending}
                  isRequired
                />
              )}
            />
            <div className="flex flex-row justify-between mt-1">
              <Link
                underline="hover"
                className="cursor-pointer text-xs"
                onClick={() => navigate("/dashboard")}
                isDisabled={updateProfileMutation.isPending}
              >
                Back to dashboard
              </Link>
            </div>
            <Button color="primary" type="submit" fullWidth isLoading={updateProfileMutation.isPending}>
              Submit
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
