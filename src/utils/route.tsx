import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import AuthRoute from "../middleware/AuthRoute";
import NotFoundPrivateRoute from "../components/NotFoundPrivateRoute";
import RoleRoute from "../middleware/RoleRoute";
import UpdateProfile from "../pages/user/UpdateProfile";
import ChangePassword from "../pages/user/ChangePassword";
import ResetPassword from "../pages/ResetPassword";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route index element={<Home />} />
      <Route path="/dashboard" element={<AuthRoute />}>
        <Route
          index
          element={
            <RoleRoute role={["user", "admin"]}>
              <Dashboard />
            </RoleRoute>
          }
        />
        <Route
          path="profile/edit"
          element={
            <RoleRoute role={["user"]}>
              <UpdateProfile />
            </RoleRoute>
          }
        />
        <Route
          path="profile/password/edit"
          element={
            <RoleRoute role={["user"]}>
              <ChangePassword />
            </RoleRoute>
          }
        />
        <Route path="*" element={<NotFoundPrivateRoute />} />
      </Route>
      <Route path="reset-password/:token" element={<ResetPassword />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

export default router;
