import Admin from "../components/dahboard/Admin";
import User from "../components/dahboard/User";
import Navbar from "../components/Navbar";
import useAuthStore from "../store/auth-store";

export default function Dashboard() {
  const { user } = useAuthStore();
  if (user?.roles == "user") {
    return (
      <>
        <Navbar />
        <User />
      </>
    );
  }
  if (user?.roles == "admin") {
    return (
      <>
        <Navbar />
        <Admin />
      </>
    );
  }
}
