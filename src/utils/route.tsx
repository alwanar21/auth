import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import AuthRoute from "../middleware/AuthRoute";
import NotFoundPrivateRoute from "../components/NotFoundPrivateRoute";
import RoleRoute from "../middleware/RoleRoute";
import Profile from "../pages/Profile";

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
          path="profile"
          element={
            <RoleRoute role={["user"]}>
              <Profile />
            </RoleRoute>
          }
        />
        <Route path="*" element={<NotFoundPrivateRoute />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

export default router;
