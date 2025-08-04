import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import Swal from "sweetalert2";
import { backendUrl } from "../App";
import CreateUser from "../pages/CreateUser";

const CheckGmail = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  const navigate = useNavigate();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (!isLoaded || hasProcessed.current) {
      return;
    }

    if (isSignedIn && user) {
      hasProcessed.current = true;
      processUserLogin();
    } else if (isLoaded) {
      navigate("/");
    }
  }, [isLoaded, isSignedIn, user, navigate]);

  const processUserLogin = async () => {
    if (
      !user ||
      !user.primaryEmailAddress ||
      !user.primaryEmailAddress.emailAddress
    ) {
      console.error("Không thể lấy thông tin email từ Clerk.");
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không thể xác thực thông tin email. Vui lòng đăng nhập lại.",
      });
      navigate("/");
      return;
    }

    const gmail = user.primaryEmailAddress.emailAddress;
    console.log("Bắt đầu kiểm tra với email:", gmail);

    try {
      const response = await axios.post(`${backendUrl}/api/user/check-gmail`, {
        gmailUser: gmail,
      });

      localStorage.setItem("person", JSON.stringify(response.data.person));
      localStorage.setItem("token", response.data.token);
      navigate("/");
    } catch (error) {
      if (error.response && error.response.status === 404) {
        try {
          await axios.post(`${backendUrl}/api/pending/get-pending-gmail`, {
            gmailUser: gmail,
          });

          navigate("/");
        } catch (pendingError) {
          if (pendingError.response && pendingError.response.status === 404) {
            console.log("Không có hồ sơ chờ. Chuyển đến trang tạo tài khoản.");
            navigate("/create-user");
          } else {
            console.error("Lỗi hệ thống khi kiểm tra pending:", pendingError);
            Swal.fire({
              icon: "error",
              title: "Lỗi",
              text: "Có lỗi xảy ra khi kiểm tra yêu cầu của bạn.",
            });
            navigate("/");
          }
        }
      } else {
        console.error("Lỗi hệ thống khi kiểm tra user:", error);
        Swal.fire({ icon: "error", title: "Lỗi", text: "Có lỗi xảy ra." });
        navigate("/");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-lg text-gray-700">
        Đang xử lý thông tin, vui lòng chờ...
      </p>
    </div>
  );
};

export default CheckGmail;
