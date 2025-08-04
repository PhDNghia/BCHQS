import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./index.css";
import CreateUser from "./pages/CreateUser";
import Home from "./pages/Home";
import CheckGmail from "./components/CheckGmail";
import UpdateUser from "./pages/UpdateUser";
import DetailUser from "./pages/DetailUser";
import { useUser } from "@clerk/clerk-react";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLogin from "./pages/AdminLogin";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

const App = () => {
  const { isSignedIn, isLoaded } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded) {
      const hasRedirected = sessionStorage.getItem("redirect_processed");

      if (isSignedIn && !hasRedirected) {
        sessionStorage.setItem("redirect_processed", "true");

        navigate("/check-gmail");
      } else if (!isSignedIn && hasRedirected) {
        sessionStorage.removeItem("redirect_processed");
      }
    }
  }, [isLoaded, isSignedIn, navigate]);

  return (
    <>
      <main className="flex-grow">
        <Routes>
          <Route path="/check-gmail" element={<CheckGmail />} />
          <Route path="/" element={<Home />} />

          <Route path="/adminlogin" element={<AdminLogin />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/create-user" element={<CreateUser />} />
            <Route path="/update-user" element={<UpdateUser />} />
            <Route path="/detail-user" element={<DetailUser />} />
          </Route>
        </Routes>
      </main>
    </>
  );
};

export default App;
