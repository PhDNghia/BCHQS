import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets.js";
import { useClerk, useUser } from "@clerk/clerk-react";

export const Navbar = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const { signOut } = useClerk();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("person");
    signOut();
    navigate("/");
  };

  return (
    <>
      <div className="flex flex-row items-center justify-between px-4 py-2">
        <div>
          <Link to="/detail-user">
            <img src={assets.logo} className="w-18 h-auto" />
          </Link>
        </div>

        {/* Nút logout + avatar */}
        <div className="relative">
          <img
            src={user.imageUrl}
            alt="avatar"
            className="w-8 h-8 rounded-full transition-transform duration-300 hover:scale-110 cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
          />

          {menuOpen && (
            <div className="absolute right-0 mt-2 bg-white text-blue-600 rounded shadow-lg overflow-hidden transform origin-top-right transition-all duration-300 ease-in-out">
              <button
                onClick={handleLogout}
                className="block w-full px-4 py-2 hover:bg-gray-100 whitespace-nowrap cursor-pointer "
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default Navbar;
