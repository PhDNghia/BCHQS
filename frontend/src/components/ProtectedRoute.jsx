import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Swal from "sweetalert2";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");

  if (token) {
    return <Outlet />;
  }

  // cho phép tạo user
  const canCreateUser = sessionStorage.getItem("can_create_user");

  if (canCreateUser === "true" && location.pathname === "/create-user") {
    return <Outlet />;
  } else {
    Swal.fire({
      title: "Quyền truy cập hạn chế",
      text: "Quản trị viên vẫn đang xem xét yêu cầu của bạn!!!",
      icon: "info",
    });
    return <Navigate to="/" replace />;
  }
};

export default ProtectedRoute;
