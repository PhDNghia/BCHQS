import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { backendUrl } from "../App";
import { useNavigate } from "react-router-dom";

const Login = ({ setToken }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();

      const response = await axios.post(backendUrl + "/api/user/admin", {
        email,
        password,
      });
      if (response.data.success) {
        setToken(response.data.token);

        navigate("/list-person");
      } else {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: response.data.message,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
        footer: error.message,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className=" max-w-[50%] h-[400px] rounded-2xl p-8  transition-all duration-300">
        <h1 className="text-2xl font-extrabold text-center text-gray-800 mb-6 leading-tight">
          Admin Ban CHQS Phường Cái Răng
        </h1>

        <form onSubmit={onSubmitHandler} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Tài khoản Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Mật khẩu
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="cursor-pointer w-full py-2.5 rounded-lg bg-black text-white text-sm font-semibold hover:bg-gray-900 transition-all"
          >
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
