import React, { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { backendUrl } from "../App";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const CheckGmail = () => {
  const { user, isSignedIn } = useUser();
  const { getToken } = useAuth(); // <-- 2. Lấy hàm getToken từ useAuth

  const navigate = useNavigate();

  useEffect(() => {
    // Chỉ chạy hàm handleLogin khi chắc chắn đã đăng nhập và có thông tin user
    if (isSignedIn && user) {
      handleLogin();
    }
  }, [isSignedIn, user]); // Phụ thuộc vào isSignedIn và user

  const handleLogin = async () => {
    try {
      // 3. LẤY TOKEN NGAY TẠI ĐÂY!
      // Đây là bước quan trọng nhất.
      const token = await getToken();

      if (user) {
        const gmail = user.primaryEmailAddress.emailAddress;

        const response = await axios.post(
          `${backendUrl}/api/user/check-gmail`,
          {
            gmailUser: gmail,
          }, // Thêm header xác thực vào đây
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          localStorage.setItem("person", JSON.stringify(response.data.person));
          localStorage.setItem("token", response.data.token);
          navigate("/home");
        } else {
          const resPending = await axios.post(
            `${backendUrl}/api/pending/get-pending-gmail`,
            {
              gmailUser: gmail,
            }
          );
          if (resPending.data.success) {
            if (!resPending) {
              navigate("/check-gmail");
            }
            navigate("/pending-status");
          } else {
            navigate("/create-user");
          }
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 503) {
        const maintenanceMessage =
          error.response.data.message || "Hệ thống đang bảo trì.";

        navigate("/maintenance", { state: { message: maintenanceMessage } });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.response?.data?.error || error.message,
        });
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

      <p className="mt-4 text-lg text-gray-700">
        Đang kiểm tra thông tin, vui lòng chờ...
      </p>
    </div>
  );
};

export default CheckGmail;
