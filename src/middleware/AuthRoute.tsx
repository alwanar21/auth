import { useQuery } from "@tanstack/react-query";
import { GetProfile } from "../services/profile-service";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import useAuthStore from "../store/auth-store";
import Navbar from "../components/Navbar";

export default function AuthRoute() {
  const { setUser } = useAuthStore();
  const profileQuery = useQuery({ queryKey: ["profile"], queryFn: GetProfile });

  useEffect(() => {
    setUser(profileQuery.data?.data.data);
  }, [profileQuery.data, setUser]);

  if (profileQuery.isLoading) {
    return (
      <div className="h-screen bg-white">
        <div className="flex justify-center items-center h-full">
          <img className="h-16 w-16" src="https://icons8.com/preloaders/preloaders/1488/Iphone-spinner-2.gif" alt="" />
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
