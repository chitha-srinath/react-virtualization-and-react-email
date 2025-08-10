import React from "react";
import { Routes, Route } from "react-router";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import NotFound from "./Pages/NotFound";
import {
  ProtectedRoute,
  RedirectAuthenticatedUser,
} from "./Wrapper/Auth-Wrapper";

// Route configuration for better maintainability
const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  LOGIN: "/login",
  REGISTER: "/register",
} as const;

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Protected Routes - All routes under this group require authentication */}
      <Route element={<ProtectedRoute />}>
        <Route index element={<Home />} />
        <Route path={ROUTES.ABOUT} element={<About />} />
      </Route>

      {/* Public Routes - Redirect if already authenticated */}
      <Route element={<RedirectAuthenticatedUser />}>
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />
      </Route>

      {/* 404 - Catch all unmatched routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
