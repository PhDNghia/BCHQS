import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets.js";
import { PersonCircle, Create, LogOut, ShieldCheckmark } from "react-ionicons";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useClerk,
  useUser,
} from "@clerk/clerk-react";
import { IoChevronDown } from "react-icons/io5";

const NavItem = ({ text, children }) => {
  return (
    <li className="relative group">
      <a
        href="#"
        className="flex items-center gap-1 text-gray-700 hover:text-blue-600 font-semibold transition-colors"
      >
        {text}
        <IoChevronDown className="transition-transform duration-300 group-hover:rotate-180" />
      </a>
      {children}
    </li>
  );
};

// Component con: Khung dropdown
const DropdownMenu = ({ children }) => {
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white rounded-md shadow-lg p-2 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 z-50">
      <ul className="space-y-1">{children}</ul>
    </div>
  );
};

// Component con: Mục trong dropdown
const DropdownItem = ({ link, children }) => {
  return (
    <li>
      <Link
        to={link}
        className="block px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 hover:text-blue-600"
      >
        {children}
      </Link>
    </li>
  );
};

export const Navbar = ({ onAdminLogout }) => {
  const { user } = useUser();
  const navigate = useNavigate();
  const { signOut } = useClerk();
  const [menuOpen, setMenuOpen] = useState(false);

  const isAdmin = sessionStorage.getItem("isAdminAuthenticated") === "true";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("person");
    signOut();
    navigate("/");
  };

  return (
    <>
      <div className="w-full flex bg-gray-200 justify-center">
        <div className="w-[90%] flex flex-row items-center justify-between px-4 py-2">
          <div>
            <Link to="/">
              <img src={assets.logo} className="w-18 h-auto" />
            </Link>
          </div>

          {/* menu */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center h-16">
              {/* Menu chính */}
              <ul className="flex space-x-8">
                {/* Mục menu đơn */}
                <li>
                  <Link
                    to="/"
                    className="text-gray-700 hover:text-blue-600 font-semibold transition-colors"
                  >
                    Trang Chủ
                  </Link>
                </li>

                {/* Mục menu có dropdown */}
                <NavItem text="Luật Dân Quân Tự Vệ">
                  <DropdownMenu>
                    <DropdownItem link="#">Quyết định</DropdownItem>
                    <DropdownItem link="#">Nghị định</DropdownItem>
                    <DropdownItem link="#">Thông tư</DropdownItem>
                  </DropdownMenu>
                </NavItem>

                {/* Mục menu có dropdown */}
                <NavItem text="Luật Nghĩa Vụ Quân Sự">
                  <DropdownMenu>
                    <DropdownItem link="#">Quyết định</DropdownItem>
                    <DropdownItem link="#">Nghị định</DropdownItem>
                    <DropdownItem link="#">Thông tư</DropdownItem>
                  </DropdownMenu>
                </NavItem>

                {/* Mục menu đơn */}
                <li>
                  <Link
                    to="/about"
                    className="text-gray-700 hover:text-blue-600 font-semibold transition-colors"
                  >
                    Về Chúng Tôi
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Nút Đăng nhập / Avatar người dùng */}
          <div>
            <SignedIn>
              <div className="relative group">
                <button className="cursor-pointer flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition">
                  <img
                    src={user?.imageUrl}
                    alt="avatar"
                    className="w-8 h-8 rounded-full"
                  />
                  <IoChevronDown />
                </button>

                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg p-2 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 z-50">
                  <ul className="space-y-1">
                    <li>
                      <Link
                        to="/detail-user"
                        className="cursor-pointer flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <PersonCircle width="20px" /> Thông tin cá nhân
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/update-user"
                        className="cursor-pointer flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Create width="20px" /> Thay đổi thông tin
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="cursor-pointer flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        <LogOut width="20px" /> Đăng xuất
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="cursor-pointer bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  Đăng nhập
                </button>
              </SignInButton>
            </SignedOut>
          </div>

          {/* NÚT MỚI: Đăng xuất cho Admin */}
          {isAdmin && (
            <button
              onClick={onAdminLogout}
              className="cursor-pointer ml-4 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Đăng xuất Admin
            </button>
          )}
        </div>
      </div>
    </>
  );
};
export default Navbar;
