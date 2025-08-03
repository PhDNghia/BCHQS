import React, { useEffect, useRef, useState } from "react";
import { assets } from "../assets/assets.js";
import { NavLink } from "react-router-dom";
import Swal from "sweetalert2";
import { backendUrl } from "../App.jsx";
import axios from "axios";

const Navbar = ({ token, setToken }) => {
  // 2. State và Ref để quản lý dropdown
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [isMaintenance, setIsMaintenance] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    setDropdownOpen(false);
    Swal.fire({
      title: "Bạn có muốn thoát khỏi trang Admin?",
      showDenyButton: true,
      showConfirmButton: false,
      showCancelButton: true,
      denyButtonText: "Đăng xuất",
    }).then((result) => {
      if (result.isDenied) {
        Swal.fire({
          title: "Thông báo",
          text: "Đã chuyển về trang đăng nhập",
          icon: "info",
          showConfirmButton: false,
          timer: 1000,
        });
        setToken("");
      } else {
        Swal.fire({
          title: "Thông báo",
          text: "Đăng xuất thất bại !!",
          icon: "error",
          footer: "Liên hệ admin: 0767376931",
          showConfirmButton: true,
        });
      }
    });
  };

  // Hàm xử lý cho mục bảo trì
  const handleMaintenance = async () => {
    const newStatus = !isMaintenance;
    setDropdownOpen(false);

    Swal.fire({
      title: newStatus ? "Bật bảo trì hệ thống" : "Tắt bảo trì hệ thống",
      input: newStatus ? "text" : "",
      inputLabel: newStatus
        ? "Thông báo bảo trì (bỏ trống nếu dùng mặc định)"
        : "",
      inputPlaceholder: "Ví dụ: Hệ thống nâng cấp từ 22:00...",
      showCancelButton: true,
      confirmButtonText: newStatus ? "Bật Bảo Trì" : "Tắt Bảo Trì",
      showLoaderOnConfirm: true,

      preConfirm: async (message) => {
        if (!token) {
          Swal.showValidationMessage(
            `Không tìm thấy token. Vui lòng đăng nhập lại.`
          );
          return;
        }

        try {
          const requestBody = { enable: newStatus };

          if (message) {
            requestBody.message = message;
          }

          const response = await axios.post(
            backendUrl + "/api/settings/maintenance",
            requestBody,
            {
              headers: { token },
            }
          );

          return response.data;
        } catch (error) {
          const errorMessage = error.response?.data?.error || "Có lỗi xảy ra.";
          Swal.showValidationMessage(`Yêu cầu thất bại: ${errorMessage}`);
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        setIsMaintenance(newStatus);
        Swal.fire("Đặt bảo trì thành công!", result.value.message, "success");
      }
    });
  };

  // 4. Hook để đóng dropdown khi người dùng click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex bg-gray-300 rounded-b-xl items-center py-2 px-[4%] justify-between">
      <NavLink
        className="flex items-center gap-3 hover:scale-105 transition-transform duration-300"
        to="/list-person"
      >
        <img className="w-18 cursor-pointer" src={assets.logo} alt="" />
      </NavLink>

      <NavLink
        className="flex items-center gap-3 border border-gray-300 px-3 py-4 rounded-1 hover:bg-blue-700 hover:text-white cursor-pointer"
        to="/list-person"
      >
        <img className="w-5 h-5" src={assets.order_icon} alt="" />
        <p className="hidden md:block">Danh sách thanh niên</p>
      </NavLink>
      <NavLink
        className="flex items-center gap-3 border border-gray-300 px-3 py-4 rounded-1 hover:bg-blue-700 hover:text-white cursor-pointer"
        to="/pending-person"
      >
        <img className="w-5 h-5" src={assets.order_icon} alt="" />
        <p className="hidden md:block">Danh sách chờ duyệt</p>
      </NavLink>

      <NavLink
        className="flex items-center gap-3 border border-gray-300 px-3 py-4 rounded-1 hover:bg-blue-700 hover:text-white cursor-pointer"
        to="/list-legal"
      >
        <img className="w-5 h-5" src={assets.order_icon} alt="" />
        <p className="hidden md:block">Danh sách bài viết</p>
      </NavLink>

      {/* 5. Thay thế nút Đăng xuất bằng Dropdown Menu */}
      <div className="relative" ref={dropdownRef}>
        {/* Nút icon mới */}
        <button
          onClick={() => setDropdownOpen(!isDropdownOpen)}
          className="p-2 rounded-full text-gray-700 hover:bg-gray-400/50 focus:outline-none"
        >
          <img
            src={assets.logo}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover cursor-pointer"
          />
        </button>

        {/* Menu dropdown */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl z-50">
            <div className="py-1">
              <div
                onClick={handleMaintenance}
                className="block cursor-pointer w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Bảo trì hệ thống
              </div>
              <div
                onClick={handleLogout}
                className="block cursor-pointer w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Đăng xuất
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
