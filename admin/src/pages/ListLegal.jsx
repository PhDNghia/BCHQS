import React, { useState, useEffect } from "react";
import axios from "axios";
import AddLegal from "./AddLegal";
import EditLegal from "./EditLegal";
import { backendUrl } from "../App";
import { useNavigate } from "react-router-dom";

// mở popup xem hình
import ImagePopup from "../components/ImagePopup";
import { useImagePopup } from "../hooks/useImagePopup.js";
import Swal from "sweetalert2";

const ListLegal = ({ token }) => {
  const [listLegal, setListLegal] = useState([]);
  const navigate = useNavigate();

  const { selectedImage, openPopup, closePopup } = useImagePopup();

  const fetchListLagel = async () => {
    try {
      const res = await axios.get(backendUrl + "/api/legal/list-legal", {
        headers: { token },
      });

      if (res.data && res.data.documents) {
        setListLegal(res.data.documents);
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

  // Lấy dữ liệu
  useEffect(() => {
    fetchListLagel();
  }, []);

  // Hàm xử lý xóa
  const handleDelete = async (id, title) => {
    try {
      const result = await Swal.fire({
        title: "Bạn có muốn xóa " + title + " ?",
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: "Đồng ý",
        denyButtonText: "Thoát",
      });

      if (result.isConfirmed) {
        const response = await axios.delete(
          backendUrl + `/api/legal/delete-legal/${id}`,
          { headers: { token } }
        );

        if (response.data) {
          fetchListLagel();
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-gray-800">Danh sách Văn bản</h1>
        <button
          onClick={() => navigate("/add-legal")}
          className="cursor-pointer bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          + Thêm văn bản
        </button>
      </div>

      <div>
        <div className="hidden md:grid grid-cols-[20px_2fr_3fr_1fr_5fr_1fr_1fr] gap-4 px-4 py-2 text-sm font-semibold text-gray-500 border-b text-center">
          <h3>STT</h3>
          <h3>Số hiệu</h3>
          <h3>Tiêu đề</h3>
          <h3>Hình ảnh</h3>
          <h3>Tóm tắt</h3>
          <h3>Loại</h3>
          <h3>Hành động</h3>
        </div>

        {listLegal.map((doc, i) => (
          <div
            key={doc._id}
            className=" p-4 md:grid md:grid-cols-[20px_2fr_3fr_1fr_5fr_1fr_1fr] md:gap-4 items-center hover:bg-gray-50  border-b transition-colors text-center"
          >
            <div className="font-medium text-gray-900">
              <span className="md:hidden font-bold text-gray-600">STT: </span>
              {i + 1}
            </div>

            <div className="font-medium text-gray-900">
              <span className="md:hidden font-bold text-gray-600">
                Số hiệu:{" "}
              </span>
              {doc.documentCode}
            </div>

            <div className="text-gray-700 mt-1 md:mt-0">
              <span className="md:hidden font-bold text-gray-600">
                Tiêu đề:{" "}
              </span>
              {doc.title}
            </div>

            <div
              className="flex items-center justify-center font-medium text-gray-900 cursor-pointer"
              onClick={() => openPopup(doc.imageUrl)}
            >
              <span className="md:hidden font-bold text-gray-600">Hình: </span>
              <img src={doc.imageUrl} alt="" className="w-20 h-20" />
            </div>

            <div className="font-medium text-gray-900">
              <span className="md:hidden text-gray-600">Tóm tắt: </span>
              {doc.summary}
            </div>

            <div className="font-medium text-gray-900">
              <span className="md:hidden font-bold text-gray-600">Loại: </span>
              {doc.documentType}
            </div>

            {/* Cột 3: Hành động */}
            <div className="h-full flex flex-wrap items-center py-4 mt-3 md:py-2 md:justify-center">
              <button
                onClick={() => navigate(`/list-legal/${doc._id}`)}
                className="cursor-pointer bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                Sửa
              </button>
              <button
                className="cursor-pointer bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                onClick={() => handleDelete(doc._id, doc.title)}
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>
      <ImagePopup imageUrl={selectedImage} onClose={closePopup} />
    </div>
  );
};

export default ListLegal;
