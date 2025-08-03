import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets.js"; // Đảm bảo bạn có link tới assets
import { useNavigate } from "react-router-dom";
import { useClerk, useUser } from "@clerk/clerk-react";
import axios from "axios";
import Swal from "sweetalert2";
import { backendUrl } from "../App.jsx";

const PendingStatus = () => {
  const { user, isSignedIn } = useUser();
  const gmail = user.primaryEmailAddress.emailAddress;

  const navigate = useNavigate();

  const { signOut } = useClerk();

  const handleBackToLogin = async () => {
    await signOut();
    navigate("/");
  };

  const handleCheckPending = async () => {
    try {
      if (gmail) {
        const response = await axios.post(
          backendUrl + "/api/pending/get-pending-gmail/",
          { gmailUser: gmail }
        );

        console.log(response);

        if (response.data.success) {
          const latestPending = response.data.pending[0];
          if (latestPending.status === "pending") {
            Swal.fire({
              title: "Vui lòng đợi",
              text: "Admin vẫn đang xem xét yêu cầu của bạn!!!",
              icon: "info",
            });
          } else if (latestPending.status === "approved") {
            Swal.fire({
              icon: "success",
              title: "Yều cầu đã được duyệt",
              text: "Admin đã phê duyệt yêu cầu của bạn, mời bạn chọn thao tác dưới đây",
              showDenyButton: true,
              showCancelButton: false,
              confirmButtonText: "Trang chính",
              denyButtonText: `Đăng xuất`,
            }).then((result) => {
              if (result.isConfirmed) {
                navigate("/check-gmail");
              } else if (result.isDenied) {
                handleBackToLogin();
              }
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Yều cầu chưa được phê duyệt",
              text: "Admin đã từ chối yêu cầu của bạn, vui lòng tạo lại tài khoản.",
              showDenyButton: true,
              showConfirmButton: false,
              showCancelButton: false,
              denyButtonText: `Đăng xuất`,
            }).then((result) => {
              if (result.isDenied) {
                handleBackToLogin();
              }
            });
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "Yều cầu chưa được phê duyệt",
            text: "Admin đã từ chối yêu cầu của bạn, vui lòng tạo lại tài khoản.",
            showDenyButton: true,
            showConfirmButton: false,
            showCancelButton: false,
            denyButtonText: `Về đăng nhập`,
          }).then((result) => {
            if (result.isDenied) {
              handleBackToLogin();
            }
          });
        }
      }
    } catch (error) {}
  };

  return (
    <div className="flex w-full items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 rounded-lg text-center w-[90%]">
        <h2 className="text-3xl font-semibold mb-6">Xin chào {gmail} !!!</h2>
        <p>
          Yêu cầu của bạn đang được admin duyệt, vui lòng đợi khi có thông báo
        </p>
        <div className="flex justify-center mb-6">
          <img
            src={assets.pending} 
            alt="Thợ sửa"
            className="w-60 h-60 object-contain"
          />
        </div>

        <button
          onClick={() => handleBackToLogin()}
          className="mr-2 w-[15%] mt-4 px-4 py-4 bg-red-400 text-white rounded
        hover:bg-red-700 items-center cursor-pointer text-xl rounded-2xl"
        >
          Trở về đăng nhập
        </button>
        <button
          onClick={() => handleCheckPending()}
          className="ml-2 w-[15%] mt-4 px-4 py-4 bg-blue-400 text-white rounded
        hover:bg-blue-700 items-center cursor-pointer text-xl rounded-2xl"
        >
          Kiểm tra yêu cầu
        </button>
      </div>
    </div>
  );
};

export default PendingStatus;
