// pages/MaintenancePage.jsx

import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useClerk, useUser } from "@clerk/clerk-react";

const MaintenancePage = ({ message }) => {
  const navigate = useNavigate();
  const { signOut } = useClerk();
  const { user, isSignedIn } = useUser();

  let displayMessage;
  // Nếu không có message được truyền vào, dùng một message mặc định
  if (message === "true") {
    displayMessage =
      "Hệ thống đang được nâng cấp để mang lại trải nghiệm tốt hơn. Vui lòng quay lại sau.";
  } else {
    displayMessage = message;
  }

  const handleLogout = () => {
    if (user) {
      localStorage.removeItem("token");
      localStorage.removeItem("person");
      signOut();
    }

    navigate("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center p-10 pb-0 bg-white rounded-lg shadow-xl  mx-auto">
        {/* <div className="text-6xl mb-4">🛠️</div> */}

        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          THÔNG BÁO BẢO TRÌ
        </h1>

        <p className="text-red-600 font-bold text-lg py-5">{displayMessage}</p>

        <div className="flex items-center justify-center py-5">
          <img src={assets.pending} className="w-50" />
        </div>

        <p className="text-xl mt-6 pb-5">Xin lỗi vì sự bất tiện này.</p>

        <div className="flex items-center justify-center">
          <button
            onClick={handleLogout}
            className="px-4 py-2 w-[40%] whitespace-nowrap cursor-pointer bg-red-500 hover:bg-red-700 text-white rounded shadow-lg transform transition-all duration-300 ease-in-out"
          >
            Đăng xuất
          </button>
        </div>

        <p className="text-sm py-5 text-gray-700">
          Liên hệ bchqsphuongcairang@gmail.com
        </p>
      </div>
    </div>
  );
};

export default MaintenancePage;
