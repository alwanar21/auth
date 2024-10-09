import { Outlet } from "react-router-dom";
import useAuthStore from "../store/auth-store";
import Forbidden from "../components/Forbidden";
import { ReactNode } from "react";

type RoleRouteProps = {
  role: string[];
  children?: ReactNode;
};

export default function RoleRoute({ role, children }: RoleRouteProps) {
  const { user } = useAuthStore();

  const hasAccess = user && role.includes(user.roles);

  return hasAccess ? <>{children || <Outlet />}</> : <Forbidden />;
}
