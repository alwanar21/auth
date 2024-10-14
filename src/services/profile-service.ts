import { z } from "zod";
import { updatePasswordValidation, updateProfileValidation } from "../validation/profile-validation";
import { PrivateInstance } from "./service";

type UpdatePasswordType = z.infer<typeof updatePasswordValidation>;
type UpdateProfileType = z.infer<typeof updateProfileValidation>;

const GetProfile = async () => {
  const result = await PrivateInstance("/api/profile", {
    method: "get",
  });

  return result;
};

const GetProfiles = async () => {
  const result = await PrivateInstance("/api/profiles", {
    method: "get",
  });

  return result;
};

const ChangePassword = async (data: UpdatePasswordType) => {
  const result = await PrivateInstance("/api/user/password", {
    data,
    method: "put",
  });
  return result;
};

const UpdateProfile = async (data: UpdateProfileType) => {
  const result = await PrivateInstance("/api/profile", {
    data,
    method: "patch",
  });
  return result;
};

const changeProfilePicture = async (data: FormData) => {
  const result = await PrivateInstance("/api/profile/profile-picture", {
    data,
    method: "put",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return result;
};

export { GetProfile, GetProfiles, UpdateProfile, ChangePassword, changeProfilePicture };
