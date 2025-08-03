import React from "react";

const Sidebar = ({ activeItem, setActiveItem }) => {
  // Use optional chaining to safely access localStorage data
  const person = JSON.parse(localStorage.getItem("person") || "{}");

  // Define menu items in an array for easier management and scalability
  const menuItems = [
    { id: "detail", label: "Thông tin cá nhân" },
    { id: "update", label: "Cập nhật thông tin" },
  ];

  return (
    <div className="bg-gray-100 p-6 min-h-screen w-64 rounded-2xl flex flex-col">
      {/* User Info Section */}
      <div className="mb-10 text-center">
        <p className="text-xl font-bold text-gray-800 mb-2">
          Xin chào,
          <br />
          <span className="text-blue-600">{person.name?.value || "Bạn"}</span> !
        </p>
        <p className="text-sm text-gray-700">Hiện tại bạn đang thuộc diện</p>
        <p className="mt-1 text-sm font-semibold text-gray-700">
          {person.categoryReason?.value || "Chưa có thông tin"}
        </p>
      </div>

      {/* Navigation Menu */}
      <ul className="space-y-2 flex-grow">
        {menuItems.map((item) => (
          <li
            key={item.id}
            onClick={() => setActiveItem(item.id)}
            className={`
              text-center px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ease-in-out
              ${
                activeItem === item.id
                  ? "bg-blue-600 text-white shadow-md transform scale-105"
                  : "text-gray-600 hover:bg-gray-200 hover:text-gray-800"
              }
            `}
          >
            <span className="font-medium">{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
