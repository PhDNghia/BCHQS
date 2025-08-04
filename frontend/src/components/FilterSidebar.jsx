import React, { useState } from "react";
import { IoSearch } from "react-icons/io5";

const FilterSidebar = ({ onSearch }) => {
  // State cục bộ để quản lý tất cả các input trong form
  const [filters, setFilters] = useState({
    field: "",
    issuingBody: "",
    issueYear: "",
    keyword: "",
    resultsCount: 50,
  });

  // Hàm xử lý chung cho tất cả các thay đổi trên input/select
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Hàm được gọi khi form được submit
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters); // Gửi state cục bộ lên component cha
  };

  const inputBaseStyle =
    "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white";

  return (
    <div className="py-6 md:py-8 rounded-lg border-y border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-6">TÌM KIẾM VĂN BẢN</h2>

      <form onSubmit={handleSubmit}>
        {/* Lưới chứa các bộ lọc */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5">
          {/* Hàng 1 */}
          <div>
            <label
              htmlFor="field"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Lĩnh vực:
            </label>
            <select
              id="field"
              name="field" // Thêm 'name' để hàm handleChange hoạt động
              value={filters.field}
              onChange={handleChange}
              className={inputBaseStyle}
            >
              <option value="">-- Tất cả các lĩnh vực --</option>
              <option value="lao-dong">Lao động</option>
              <option value="doanh-nghiep">Doanh nghiệp</option>
              <option value="giao-thong">Giao thông</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="issuingBody"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Cơ quan ban hành:
            </label>
            <select
              id="issuingBody"
              name="issuingBody"
              value={filters.issuingBody}
              onChange={handleChange}
              className={inputBaseStyle}
            >
              <option value="">-- Tất cả --</option>
              <option value="Quốc hội">Quốc hội</option>
              <option value="Chính phủ">Chính phủ</option>
              <option value="Bộ Công an">Bộ Công an</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="issueYear"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Năm ban hành:
            </label>
            <select
              id="issueYear"
              name="issueYear"
              value={filters.issueYear}
              onChange={handleChange}
              className={inputBaseStyle}
            >
              <option value="">-- Tất cả --</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </div>

          {/* Hàng 2 */}
          {/* Dùng col-span-2 để ô tìm kiếm chiếm 2/3 không gian */}
          <div className="md:col-span-2">
            <label
              htmlFor="keyword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tìm kiếm:
            </label>
            <input
              type="text"
              id="keyword"
              name="keyword"
              placeholder="Nhập từ khóa"
              value={filters.keyword}
              onChange={handleChange}
              className={inputBaseStyle}
            />
          </div>

          <div>
            <label
              htmlFor="resultsCount"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Số lượng kết quả:
            </label>
            <input
              type="number"
              id="resultsCount"
              name="resultsCount"
              value={filters.resultsCount}
              onChange={handleChange}
              className={inputBaseStyle}
            />
          </div>
        </div>

        {/* Nút Tìm kiếm */}
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="flex items-center gap-2 bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <IoSearch />
            Tìm kiếm
          </button>
        </div>
      </form>
    </div>
  );
};

export default FilterSidebar;
