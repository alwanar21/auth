import {
  Avatar,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import useAuthStore from "../../store/auth-store";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { changeProfilePictureValidation } from "../../validation/profile-validation";
import { BsImages, BsPaperclip } from "react-icons/bs";
import { useState } from "react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { formatErrors } from "../../utils/format-errors";
import { changeProfilePicture } from "../../services/profile-service";
import { useMutation } from "@tanstack/react-query";

export default function User() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  type ChangeProfilePictureValidationType = z.infer<typeof changeProfilePictureValidation>;

  const changeProfilePictureMutation = useMutation({
    mutationFn: changeProfilePicture,
    onSuccess: (data) => {
      toast.success(data?.data?.message);
      useAuthStore.getState().changeUser({
        picture: data.data.data.picture,
      });
      onCloseModal();
      reset();
    },
    onError: (error) => {
      console.log(error, "error");
      if (error instanceof AxiosError) {
        if (Array.isArray(error.response?.data?.message)) {
          const formattedErrors = formatErrors(error.response?.data?.message);
          setError("picture", formattedErrors?.picture);
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
    handleSubmit,
    reset,
    control,
    setError,
    formState: { errors },
  } = useForm<ChangeProfilePictureValidationType>({
    resolver: zodResolver(changeProfilePictureValidation),
  });
  const onSubmit: SubmitHandler<ChangeProfilePictureValidationType> = (data) => {
    const body = new FormData();
    body.append("picture", data.picture[0]);
    changeProfilePictureMutation.mutate(body);
  };

  const onCloseModal = () => {
    setSelectedImage(null);
    reset();
    onClose();
  };

  return (
    <>
      <div className="container mx-auto px-3 sm:px-0">
        <div className="">
          <div className="my-3">
            <Avatar src={user?.picture} className="w-28 h-28 text-large" />
          </div>
          <div className="flex flex-row gap-4">
            <h1 className="min-w-20">Name </h1>
            <p className="">: {user?.username}</p>
          </div>
          <div className="flex flex-row gap-4">
            <h1 className="min-w-20">Email </h1>
            <p className="">: {user?.email}</p>
          </div>
          <div className="flex flex-row gap-4">
            <h1 className="min-w-20">Birth Date </h1>
            <p className="">: {user?.birthDate ? moment(user?.birthDate).format("LL") : "-"}</p>
          </div>
          <div className="flex flex-row gap-4">
            <h1 className="min-w-20">Role </h1>
            <p className="">: {user?.roles}</p>
          </div>
        </div>

        <div className="flex flex-row gap-3 mt-2">
          <Button size="sm" variant="flat" color="warning" onClick={onOpen}>
            Change Photo profile
          </Button>
          <Button size="sm" variant="flat" color="primary" onClick={() => navigate("profile/edit")}>
            Edit profile
          </Button>
          <Button size="sm" color="primary" className="text-white" onClick={() => navigate("profile/password/edit")}>
            Change password
          </Button>
        </div>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} isKeyboardDismissDisabled={true}>
        <ModalContent>
          <>
            <ModalHeader className="flex flex-col gap-1 items-center">Change Photo Profile</ModalHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <ModalBody>
                <div
                  className={`flex  md:flex-[1] h-[fit-content] md:p-4 md:justify-between md:flex-row items-center justify-center `}
                >
                  {selectedImage ? (
                    <div className="md:max-w-[200px] mx-auto">
                      <img src={URL.createObjectURL(selectedImage)} alt="Selected" />
                    </div>
                  ) : (
                    <div className="inline-flex items-center justify-center w-full ">
                      <div className="p-3 bg-slate-200  justify-center items-center flex ">
                        <BsImages size={100} />
                      </div>
                    </div>
                  )}
                </div>
                {errors.picture?.message && <div className="text-red-500 text-sm mx-auto">Error broooo</div>}
                <Controller
                  control={control}
                  name="picture"
                  render={({ field }) => (
                    <Button
                      size="sm"
                      type="button"
                      className="p-0 "
                      isDisabled={changeProfilePictureMutation.isPending}
                    >
                      <input
                        type="file"
                        className="hidden"
                        id="fileInput"
                        accept="image/*"
                        onBlur={field.onBlur}
                        name={field.name}
                        onChange={(e) => {
                          field.onChange(e.target.files);
                          setSelectedImage(e.target.files?.[0] || null);
                        }}
                        ref={field.ref}
                      />
                      <label
                        htmlFor="fileInput"
                        className="h-full w-full text-neutral-90 rounded-md cursor-pointer items-center flex justify-center"
                      >
                        <BsPaperclip />
                        <span className="whitespace-nowrap">choose your image</span>
                      </label>
                    </Button>
                  )}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={onCloseModal}
                  isDisabled={changeProfilePictureMutation.isPending}
                >
                  Close
                </Button>
                <Button color="primary" type="submit" isLoading={changeProfilePictureMutation.isPending}>
                  Submit
                </Button>
              </ModalFooter>
            </form>
          </>
        </ModalContent>
      </Modal>
    </>
  );
}
