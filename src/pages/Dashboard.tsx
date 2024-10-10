import Admin from "../components/dashboard/Admin";
import User from "../components/dashboard/User";
import useAuthStore from "../store/auth-store";

export default function Dashboard() {
  const { user } = useAuthStore();
  if (user?.roles == "user") {
    return <User />;
  }
  if (user?.roles == "admin") {
    return <Admin />;
  }
}
