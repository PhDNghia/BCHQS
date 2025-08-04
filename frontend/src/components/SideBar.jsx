
import React from "react";

const Sidebar = () => {
  // Kiểu style chung cho các mục con
  const linkStyle =
    "block py-1 text-gray-600 hover:text-blue-600 hover:underline";
  const subHeaderStyle =
    "mt-4 font-bold text-gray-800 text-sm uppercase tracking-wider";

  return (
    <aside className="py-6 md:py-8 rounded-lg border-y border-gray-100">
      <nav>
        <ul>
          <li>
            <a
              href="#"
              className="block py-2 text-red-600 font-bold border-b-2 border-red-600"
            >
              Tất cả văn bản
            </a>
          </li>
          <li>
            <a href="#" className={linkStyle + " mt-2"}>
              Văn bản mới
            </a>
          </li>

          <li className="mt-4 pt-4 border-t">
            <h3 className="font-bold text-gray-900">
              Văn bản quy phạm pháp luật
            </h3>
            <ul className="pl-4 mt-2 space-y-1">
              <li>
                <span className={subHeaderStyle}>Cơ quan ban hành</span>
                <ul className="pl-3 mt-1 text-sm">
                  <li>
                    <a href="#" className={linkStyle}>
                      Quốc hội
                    </a>
                  </li>
                  <li>
                    <a href="#" className={linkStyle}>
                      Chính phủ
                    </a>
                  </li>
                  <li>
                    <a href="#" className={linkStyle}>
                      Thủ tướng Chính phủ
                    </a>
                  </li>
                  {/* ... */}
                </ul>
              </li>
              <li>
                <span className={subHeaderStyle}>Loại văn bản</span>
                <ul className="pl-3 mt-1 text-sm">
                  <li>
                    <a href="#" className={linkStyle}>
                      Hiến pháp
                    </a>
                  </li>
                  <li>
                    <a href="#" className={linkStyle}>
                      Luật - Pháp lệnh
                    </a>
                  </li>
                  <li>
                    <a href="#" className={linkStyle}>
                      Nghị định
                    </a>
                  </li>
                  {/* ... */}
                </ul>
              </li>
            </ul>
          </li>

          <li className="mt-4 pt-4 border-t">
            <a href="#" className={linkStyle}>
              Văn bản hợp nhất
            </a>
          </li>
          <li className="mt-2">
            <a href="#" className={linkStyle}>
              Văn bản chỉ đạo điều hành
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
