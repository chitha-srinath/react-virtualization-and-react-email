import { Routes, Route } from "react-router";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import { AuthWrapper } from "./Wrapper/Auth-Wrapper";
import AuthLayout from "./Layouts/AuthLayout";

function AppRoutes() {
  return (
    <Routes>
      <Route
        element={
          <AuthWrapper>
            <AuthLayout />
          </AuthWrapper>
        }
      >
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
      </Route>
      <Route
        element={
          <AuthWrapper>
            <AuthLayout />
          </AuthWrapper>
        }
      >
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

      {/* <Route path="concerts">
        <Route index element={<ConcertsHome />} />
        <Route path=":city" element={<City />} />
        <Route path="trending" element={<Trending />} />
      </Route> */}
    </Routes>
  );
}

export default AppRoutes;
