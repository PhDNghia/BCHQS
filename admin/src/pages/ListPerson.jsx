import axios from "axios";
import React, { useEffect, useState } from "react";
import { backendUrl } from "../App";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { IoChevronDown, IoChevronUp } from "react-icons/io5"; // Import icon

// mở popup xem hình
import ImagePopup from "../components/ImagePopup";
import { useImagePopup } from "../hooks/useImagePopup.js";

const ListPerson = ({ token }) => {
  const [list, setList] = useState([]);
  const [nameFilter, setNameFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [generalFilter, setGeneralFilter] = useState("");
  const navigate = useNavigate();

  // State để điều khiển việc đóng/mở panel tìm kiếm
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  //popup image
  const { selectedImage, openPopup, closePopup } = useImagePopup();

  // popup hiện checkbox các trường
  const [excelOpen, setExcelOpen] = useState(false);
  const [selectedFields, setSelectedFields] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/person/list", {
        headers: { token },
      });

      if (response.data.success) {
        const persons = response.data.persons;
        const adminEmail = "thenghia1906@gmail.com";

        persons.sort((a, b) => {
          if (a.gmailUser?.value === adminEmail) return -1;
          if (b.gmailgmailUser?.value === adminEmail) return 1;
          return 0;
        });

        setList(response.data.persons);
      } else {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: response.data.message,
          footer: "Liên hệ admin: 0767376931",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: error.message,
        footer: "Liên hệ admin: 0767376931",
      });
    }
  };

  const removePerson = async (id, name) => {
    try {
      const result = await Swal.fire({
        title: "Bạn có muốn xóa " + name + " ?",
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: "Đồng ý",
        denyButtonText: "Thoát",
      });

      if (result.isConfirmed) {
        const response = await axios.post(
          backendUrl + "/api/person/remove",
          { id },
          { headers: { token } }
        );

        if (response.data.success) {
          fetchList();
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Xóa thành công!",
            timer: 1000,
            confirmButton: false,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: response.data.message,
            footer: "Liên hệ admin: 0767376931",
          });
        }
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: error.message,
        footer: "Liên hệ admin: 0767376931",
      });
    }
  };

  // tìm kiếm
  const handleSearch = async () => {
    const params = new URLSearchParams();
    if (nameFilter) params.append("name", nameFilter);
    if (statusFilter) params.append("status", statusFilter);
    if (generalFilter) params.append("query", generalFilter);

    try {
      const response = await axios.get(
        backendUrl + `/api/person/list-search?${params.toString()}`,
        { headers: { token } }
      );
      const data = response.data;

      if (Array.isArray(data)) {
        console.log("Dữ liệu là mảng, số phần tử:", data.length);
        setList(data);
      } else if (data.message === "None") {
        Swal.fire({
          icon: "info",
          title: "Không tìm thấy",
          text: "Không có kết quả phù hợp!",
          showConfirmButton: false,
          timer: 1000,
        });
        setList([]);
      } else {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: response.data.message,
          footer: "Liên hệ admin: 0767376931",
        });
        setList([]);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: error.message,
        footer: "Liên hệ admin: 0767376931",
      });
    }
  };

  const handleResetFilter = () => {
    setNameFilter("");
    setStatusFilter("");
    setGeneralFilter("");
    navigate("/list-person");
    fetchList();
  };

  // đếm checkbox
  const toggleField = (field) => {
    setSelectedFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  };
  //-------------------------------------------------------
  const allFields = [
    { key: "name", label: "Họ tên" },
    { key: "birth", label: "Ngày sinh" },
    { key: "sex", label: "Giới tính" },
    { key: "image", label: "Hình ảnh" },
    { key: "idNumber", label: "Căn cước công dân" },
    { key: "occupation", label: "Nghề nghiệp" },
    { key: "permanentAddress", label: "Địa chỉ thường trú" },
    { key: "temporaryAddress", label: "Địa chỉ tạm trú" },
    { key: "ethnicity", label: "Dân tộc" },
    { key: "religion", label: "Tôn giáo" },
    { key: "educationLevel", label: "Trình độ học vấn" },
    { key: "professionalLevel", label: "Trình độ chuyên môn" },
    { key: "wife", label: "Vợ" },
    { key: "children", label: "Con cái" },
    { key: "fatherInfo", label: "Thông tin cha" },
    { key: "motherInfo", label: "Thông tin mẹ" },
    { key: "siblings", label: "Anh chị em" },
    { key: "education", label: "Học vấn" },
    { key: "phone", label: "Số điện thoại" },
    { key: "category", label: "Phân loại" },
    { key: "categoryReason", label: "Lý do phân loại" },
    { key: "gmailUser", label: "Email" },
    { key: "date", label: "Ngày tạo" },
  ];

  // xuất excel người dùng tự chọn trường hiển thị trên excel
  const exportToExcel = () => {
    const mappedData = list.map((item) => {
      const filtered = {};
      selectedFields.forEach((f) => {
        if (f === "image") {
          filtered[f] = item[f]?.value?.length > 0 ? item[f].value[0] : "";
        } else {
          filtered[f] = item[f]?.value || "";
        }
      });
      return filtered;
    });

    const ws = XLSX.utils.json_to_sheet(mappedData);

    // Ghi lại header theo label trong allFields
    selectedFields.forEach((fieldKey, index) => {
      const fieldLabel =
        allFields.find((f) => f.key === fieldKey)?.label || fieldKey;
      // Cột bắt đầu từ A (65 trong ASCII)
      const cellRef = String.fromCharCode(65 + index) + "1";
      ws[cellRef].v = fieldLabel;
    });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "filtered-data.xlsx");

    setExcelOpen(false);
    setSelectedFields([]);
  };
  //---------------------------------------

  // Hàm để bật/tắt panel
  const toggleSearchPanel = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      {/* ------------------------------------Popup chọn checkbox---------------------------- */}
      {excelOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div className="bg-white border rounded-lg shadow-lg p-8 w-[80%] max-h-[100vh]">
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
              Chọn trường cần xuất Excel
            </h2>

            <div className="grid grid-cols-3 gap-x-8 gap-y-4 max-h-[90vh]">
              {allFields.map((field) => (
                <label
                  key={field.key}
                  className="flex items-center space-x-3 cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={selectedFields.includes(field.key)}
                    onChange={() => toggleField(field.key)}
                    className="w-5 h-5 accent-blue-600 cursor-pointer"
                  />
                  <span className="text-gray-700">{field.label}</span>
                </label>
              ))}
            </div>

            <div className="mt-8 flex justify-end space-x-4">
              <button
                onClick={() => setExcelOpen(false)}
                className="px-5 py-2 rounded-md bg-gray-300 hover:bg-gray-400 text-gray-700 transition cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={exportToExcel}
                className="px-5 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition cursor-pointer"
              >
                Xuất Excel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------------- */}

      <div className="flex justify-between items-center mb-2">
        <h1 className="text-xl font-bold text-gray-800">
          Danh sách công dân trong nguồn NVQS
        </h1>

        <button
          onClick={toggleSearchPanel}
          // 1. Thêm 'relative' và đặt kích thước cố định (ví dụ: w-40 h-10)
          className="relative group w-25 h-10 flex items-center justify-center cursor-pointer bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors shadow-sm overflow-hidden"
        >
          {/* 2. Text: Hiện mặc định, mờ đi khi hover */}
          <span className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-100 group-hover:opacity-0">
            {isSearchOpen ? "Đóng" : "Tìm kiếm"}
          </span>

          {/* 3. Icon: Ẩn mặc định, hiện ra khi hover */}
          <span className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-0 group-hover:opacity-100">
            {isSearchOpen ? (
              <IoChevronUp size={22} />
            ) : (
              <IoChevronDown size={22} />
            )}
          </span>
        </button>

        <button
          className="cursor-pointer bg-pink-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-pink-700 transition-colors shadow-sm"
          onClick={() => setExcelOpen(true)}
        >
          Xuất Excel
        </button>

        <button
          onClick={() => navigate("/add-legal")}
          className="cursor-pointer bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          + Thêm công dân
        </button>
      </div>

      {/* {/* --------------------Tìm Kiếm---------------------------------- */}
      {isSearchOpen && (
        <>
          <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <b>Tìm kiếm theo tên</b>
              <input
                type="text"
                placeholder="Lọc theo tên..."
                className="w-full px-4 py-2 mt-2 border rounded shadow-sm"
                value={nameFilter || ""}
                onChange={(e) => setNameFilter(e.target.value)}
              />
            </div>

            <div className="flex-1">
              <b>Tìm kiếm theo phân loại</b>
              <select
                className="w-full px-4 py-2 mt-2 border rounded shadow-sm"
                value={statusFilter || ""}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value=""></option>
                <option value="Đủ điều kiện">Đủ điều kiện</option>
                <option value="Chưa gọi">Chưa gọi</option>
                <option value="Tạm hoãn">Tạm hoãn</option>
                <option value="Hết tuổi">Hết tuổi</option>
                <option value="Thiếu tuổi">Thiếu tuổi</option>
                <option value="Giải ngạch">Giải ngạch</option>
                <option value="Xuất ngũ">Xuất ngũ</option>
                <option value="Chuyển khẩu">Chuyển khẩu</option>
                <option value="Cắt khỏi nguồn">Cắt khỏi nguồn</option>
              </select>
            </div>

            <div className="flex-1">
              <b>Tìm kiếm</b>
              <input
                type="text"
                placeholder="Lọc tất cả trường..."
                className="w-full px-4 py-2 mt-2 border rounded shadow-sm"
                value={generalFilter || ""}
                onChange={(e) => setGeneralFilter(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleSearch}
              className="flex-1 w-full px-4 py-2 mb-4 bg-blue-600 text-white rounded hover:bg-blue-700 items-center cursor-pointer"
            >
              Tìm kiếm
            </button>
            <button
              onClick={() => handleResetFilter()}
              className="flex-1 w-full px-4 py-2 mb-4 bg-gray-600 text-white rounded hover:bg-gray-700 items-center cursor-pointer"
            >
              Xóa lọc
            </button>
          </div>
        </>
      )}
      {/* {/* ----------------------------------List-------------------------------------- */}
      <div className="grid gap-2 mt-6">
        {/* ----------------list table title------------------- */}
        <div className="grid grid-cols-[40px_80px_1fr_1fr_1fr_1fr_1fr_1fr_100px] items-center py-1 border-b text-sm font-bold">
          <div className="text-center border-r px-2">STT</div>
          <div className="text-center border-r px-2">Hình</div>
          <div className="text-center border-r px-2">Thông tin cá nhân</div>
          <div className="text-center border-r px-2">Thông tin nơi ở</div>
          <div className="text-center border-r px-2">Thông tin cha mẹ</div>
          <div className="text-center border-r px-2">Thông tin vợ con</div>
          <div className="text-center border-r px-2">Phân loại</div>
          <div className="text-center border-r px-2">Gmail</div>
          <div className="text-center px-2">Thao tác</div>
        </div>

        {/* -------------------product list------------------------- */}
        {list.length > 0 ? (
          list.map((item, index) => (
            <div
              className="grid grid-cols-[40px_80px_1fr_1fr_1fr_1fr_1fr_1fr_100px] items-center py-1 border-b text-sm"
              key={index}
            >
              <p className="text-center border-r px-2">{index + 1}</p>

              <div
                className="flex items-center justify-center border-r h-full w-full px-2 cursor-pointer"
                onClick={() => {
                  if (item.image?.value && item.image.value.length > 0) {
                    openPopup(item.image.value);
                  }
                }}
              >
                <img
                  className="w-16 h-16 object-cover rounded-md"
                  src={
                    item.image?.value && item.image.value.length > 0
                      ? item.image.value[0]
                      : "/path-to-default-image.png"
                  }
                  alt={item.name?.value || "Ảnh người dùng"}
                />
              </div>

              <div className="text-center border-r px-2 line-clamp-3">
                {item.name?.value} <br />
                {item.birth?.value} <br />
                {item.idNumber?.value}
              </div>

              <div className="text-center border-r px-2 line-clamp-3">
                <b>Tạm trú: </b> {item.temporaryAddress?.value || ""}
              </div>

              <div className="text-center border-r px-2 line-clamp-3">
                {item.fatherInfo?.value || ""} <br />
                {item.motherInfo?.value || ""}
              </div>

              <div className="text-center border-r px-2 line-clamp-3">
                {item.wife?.value || ""} <br />
                {item.children?.value || ""}
              </div>

              <div className="text-center border-r px-2 line-clamp-3">
                <b>{item.category?.value}</b> <br />
                {item.categoryReason?.value}
              </div>

              <div className="text-center border-r px-2 line-clamp-3">
                {item.gmailUser?.value}
              </div>

              <div className="flex flex-col justify-center items-center gap-2 h-full px-2">
                <button
                  onClick={() => navigate(`/list-person/${item._id}`)}
                  className="w-[100%] px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 items-center cursor-pointer"
                >
                  Sửa
                </button>
                {item.gmailUser.value === "thenghia1906@gmail.com" ? (
                  ""
                ) : (
                  <button
                    onClick={() => removePerson(item._id, item.name.value)}
                    className="w-[100%] px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 items-center cursor-pointer"
                  >
                    Xóa
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>Không có kết quả phù hợp.</p>
        )}
      </div>
      <ImagePopup imageUrl={selectedImage} onClose={closePopup} />
    </>
  );
};

export default ListPerson;
