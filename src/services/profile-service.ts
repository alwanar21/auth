import { PrivateInstance } from "./service";

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

export { GetProfile, GetProfiles };
