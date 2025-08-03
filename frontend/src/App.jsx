import React, { useEffect } from "react";
import { useUser, SignIn, useClerk } from "@clerk/clerk-react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./index.css";
import CreateUser from "./pages/CreateUser";
import Home from "./pages/Home";
import CheckGmail from "./components/CheckGmail";
import PendingStatus from "./pages/PendingStatus";
import ScrollToTopButton from "../src/components/ScrollToTopButton";
import MaintenancePage from "./pages/MaintenancePage";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

const App = () => {
  const { user, isSignedIn } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn) {
      navigate("/check-gmail");
    }
  }, [isSignedIn]);

  if (!isSignedIn) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="p-4 rounded">
          <SignIn />
        </div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/check-gmail" element={<CheckGmail />} />
        <Route path="/pending-status" element={<PendingStatus />} />
        <Route path="/home" element={<Home />} />
        <Route path="/create-user" element={<CreateUser />} />
        <Route path="/check-gmail" element={<CheckGmail />} />
        <Route path="/maintenance" element={<MaintenancePage />} />
      </Routes>
      <ScrollToTopButton />
    </>
  );
};

export default App;
