import { useEffect, useState } from "react";
import Register from "../components/auth/Register";
import EmailVerification from "../components/auth/EmailVerification";
import ForgotPassword from "../components/auth/ForgotPassword";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/auth-store";
import Cookies from "js-cookie";
import Login from "../components/auth/Login";

export default function Home() {
  const [form, setForm] = useState<"login" | "register" | "forgotPassword" | "email verification">("login");
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  useEffect(() => {
    const isAuthenticatedCookies = Cookies.get("isAuthenticated");
    if (isAuthenticatedCookies == "true" || isAuthenticated == true) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);
  return (
    <div className="flex w-full min-h-screen">
      <div className=" min-h-screen flex-1 hidden lg:flex justify-center items-center">
        <div className="">
          <h3 className="text-4xl font-semibold">Auth App</h3>
          <p className="max-w-[480px] mt-3 text-xl">
            Empowering Secure, Seamless Access for Every User, Every Time. Experience authentication that’s both
            powerful and easy to use
          </p>
        </div>
      </div>
      <div className="min-h-screen w-full lg:w-2/6 lg:min-w-[500px]">
        {form == "login" && <Login setForm={setForm} />} {form == "register" && <Register setForm={setForm} />}{" "}
        {form == "email verification" && <EmailVerification setForm={setForm} />}{" "}
        {form == "forgotPassword" && <ForgotPassword setForm={setForm} />}
      </div>
    </div>
  );
}
