import Cookies from "js-cookie";

const setAccessTokenCookies = (accessToken: string): void => {
  const options: Cookies.CookieAttributes = {
    expires: new Date(Date.now() + 60 * 60 * 1000),
    path: "/",
    secure: window.location.protocol === "https:",
    sameSite: "Strict",
  };

  Cookies.set("accessToken", accessToken, options);
};

const setRefreshTokenCookies = (refreshToken: string): void => {
  const options: Cookies.CookieAttributes = {
    expires: 7,
    path: "/",
    secure: window.location.protocol === "https:",
    sameSite: "Strict",
  };

  Cookies.set("refreshToken", refreshToken, options);
};

export { setAccessTokenCookies, setRefreshTokenCookies };
