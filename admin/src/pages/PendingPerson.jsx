import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import Swal from "sweetalert2";

// mở popup xem hình
import ImagePopup from "../components/ImagePopup";
import { useImagePopup } from "../hooks/useImagePopup.js";

const PendingPerson = ({ token }) => {
  const [pending, setpending] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [popupData, setPopupData] = useState(null);

  const { selectedImage, openPopup, closePopup } = useImagePopup();

  //lưu những id pending đã chọn
  const [selectedPendingIds, setSelectedPendingIds] = useState([]);

  // Fetch pending từ API
  const fetchpending = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(backendUrl + "/api/pending/get-pending", {
        headers: { token },
      });
      if (res.data.success) {
        setpending(res.data.pending);
      } else {
        setError("Lấy dữ liệu thất bại");
      }
    } catch (err) {
      setError("Lỗi kết nối API");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchpending();
  }, []);

  // Xử lý review (duyệt hoặc từ chối)
  const handleReview = async (pendingId, status) => {
    try {
      const res = await axios.post(
        backendUrl + "/api/pending/update-pending",
        { pendingId, status, reviewer: "PhD Nghĩa" },
        { headers: { token } }
      );
      if (res.data.success) {
        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: res.data.message,
          timer: 1500,
          showConfirmButton: false,
        });
        fetchpending(); // refresh lại danh sách
      } else {
        Swal.fire({
          icon: "error",
          title: "Thất bại",
          text: res.data.message,
          footer: "Liên hệ admin: 0767376931",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi server",
        text: error.message,
        footer: "Liên hệ admin: 0767376931",
      });
    }
  };

  //delete pending
  const handleDelete = async (pendingId) => {
    try {
      const res = await axios.post(
        backendUrl + "/api/pending/remove-pending",
        { pendingId },
        { headers: { token } }
      );
      if (res.data.success) {
        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: res.data.message,
          timer: 1500,
          showConfirmButton: false,
        });
        fetchpending();
      } else {
        Swal.fire({
          icon: "error",
          title: "Thất bại",
          text: res.data.message,
          footer: "Liên hệ admin: 0767376931",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi server",
        text: error.message,
        footer: "Liên hệ admin: 0767376931",
      });
    }
  };

  // ghi lại id của từng checkbox checked
  const togglePendingSelection = (id) => {
    if (selectedPendingIds.includes(id)) {
      setSelectedPendingIds(
        selectedPendingIds.filter((pendingId) => pendingId !== id)
      );
    } else {
      setSelectedPendingIds([...selectedPendingIds, id]);
    }
  };

  //delete nhiều pending
  const handleSelectPending = async () => {
    if (selectedPendingIds.length > 0) {
      try {
        const res = await axios.post(
          backendUrl + "/api/pending/remove-more-pending",
          { ids: selectedPendingIds },
          { headers: { token } }
        );

        if (res.data.success) {
          Swal.fire({
            icon: "success",
            title: "Thành công",
            text: res.data.message,
            timer: 1500,
            showConfirmButton: false,
          });
          fetchpending();
        } else {
          Swal.fire({
            icon: "error",
            title: "Thất bại",
            text: res.data.message,
            footer: "Liên hệ admin: 0767376931",
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Lỗi server",
          text: error.message,
          footer: "Liên hệ admin: 0767376931",
        });
      }
    }
  };

  const openPopupDetail = (p) => {
    setPopupData(p);
  };

  const closePopupDetail = () => setPopupData(null);

  return (
    <div>
      <h2 className="text-xl font-bold mb-6 text-center">
        Danh sách yêu cầu chờ duyệt
      </h2>

      {loading && (
        <div className="text-center text-gray-600">Đang tải dữ liệu...</div>
      )}

      {error && <div className="text-center text-red-600 mb-4">{error}</div>}

      <div
        className={`hidden md:flex font-semibold border-b border-gray-400 ${
          selectedPendingIds.length > 0 ? "pb-2" : "pb-4"
        }  mb-2 text-gray-700 text-center`}
      >
        <div className="w-1/12">STT</div>
        <div className="w-3/12">Người gửi</div>
        <div className="w-1/12">Yêu cầu</div>
        <div className="w-2/12">Thông tin</div>
        <div className="w-1/12">Trạng thái</div>
        <div className="w-2/12">Ngày tạo</div>
        <div className="w-2/12">
          {selectedPendingIds.length && pending.length ? (
            <button
              onClick={() => handleSelectPending()}
              className="items-center justify-center px-2 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition cursor-pointer"
            >
              Xóa nhiều
            </button>
          ) : (
            <div>Thao tác</div>
          )}
        </div>
      </div>

      {!loading && pending.length === 0 && (
        <div className="text-center text-gray-600 mt-8">
          Không có yêu cầu nào
        </div>
      )}

      <div className="space-y-4">
        {pending.map((p, i) => (
          <div
            key={p._id}
            className="flex flex-col md:flex-row items-center text-center justify-between border-b border-gray-300 py-4"
          >
            <div className=" flex w-full md:w-1/12 justify-center items-center font-semibold break-words text-center md:text-left mb-2 md:mb-0">
              <div className="w-[15%] h-full flex ">
                <input
                  className="cursor-pointer"
                  type="checkbox"
                  onChange={() => p?._id && togglePendingSelection(p._id)}
                  checked={p?._id && selectedPendingIds.includes(p._id)}
                />
              </div>

              <div className="w-[85%] text-center">{i + 1}</div>
            </div>
            <div className="w-full md:w-3/12 font-semibold text-center mb-2 md:mb-0">
              {p.gmailUser?.value}
            </div>
            <div className="w-full md:w-1/12 text-center mb-2 md:mb-0">
              {p.actionType === "add" ? "Thêm mới" : "Cập nhật"}
            </div>
            <div className="w-full md:w-2/12 text-center mb-2 md:mb-0">
              <button
                onClick={() => openPopupDetail(p)}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition cursor-pointer"
              >
                Xem chi tiết
              </button>
            </div>
            <div className="w-full md:w-1/12 capitalize text-center mb-2 md:mb-0">
              {p.status === "pending"
                ? "Đang chờ"
                : p.status === "approved"
                ? "Đã duyệt"
                : "Từ chối"}
            </div>
            <div className="w-full md:w-2/12 capitalize font-semibold text-center mb-2 md:mb-0">
              {new Date(p.createdAt).toLocaleString("vi-VN")}
            </div>
            <div className="w-full md:w-2/12 space-x-2 text-center">
              {p.status === "pending" ? (
                <>
                  <button
                    onClick={() => handleReview(p._id, "approved")}
                    className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition cursor-pointer"
                  >
                    Duyệt
                  </button>
                  <button
                    onClick={() => handleReview(p._id, "rejected")}
                    className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition cursor-pointer"
                  >
                    Từ chối
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center">
                  <span className="text-gray-500 italic">Đã xử lý</span>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="mt-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition cursor-pointer"
                  >
                    Xóa
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Popup Thông tin chi tiết */}
      {popupData && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          onClick={closePopup}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-xl max-h-[90vh] overflow-y-auto w-full max-w-6xl border-2 border-black no-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-semibold mb-6 text-center">
              {popupData.actionType === "add"
                ? "Chi tiết yêu cầu thêm mới"
                : "So sánh thông tin cập nhật"}
            </h3>

            {/* --- BỐ CỤC MỚI CHO POPUP --- */}
            <div className="space-y-4">
              {Object.keys(popupData.newData).map((key) => {
                const labelMap = {
                  name: "Họ tên",
                  birth: "Ngày sinh",
                  sex: "Giới tính",
                  idNumber: "Số CMND/CCCD",
                  ethnicity: "Dân tộc",
                  religion: "Tôn giáo",
                  occupation: "Nghề nghiệp",
                  permanentAddress: "Địa chỉ thường trú",
                  temporaryAddress: "Địa chỉ tạm trú",
                  phone: "Số điện thoại",
                  gmailUser: "Email",
                  educationLevel: "Trình độ học vấn",
                  professionalLevel: "Trình độ chuyên môn",
                  children: "Thông tin con",
                  wife: "Thông tin vợ",
                  fatherInfo: "Thông tin cha",
                  motherInfo: "Thông tin mẹ",
                  siblings: "Anh chị em",
                  category: "Phân loại",
                  categoryReason: "Lí do phân loại",
                  education: "Quá trình học tập",
                  image: "Hình ảnh",
                  date: "Ngày tạo",
                };
                const label = labelMap[key] || key;

                if (key === "_id" || key === "editable" || key === "__v")
                  return null;

                // --- HIỂN THỊ HÌNH ẢNH ---
                if (key === "image") {
                  // SỬA: Không hiển thị khối này khi là "add"
                  if (popupData.actionType === "add") {
                    return null;
                  }

                  const newImages = popupData.newData.image?.value || [];
                  const oldImages = popupData.oldData?.image?.value || [];
                  const hasImagesChanged =
                    JSON.stringify(oldImages) !== JSON.stringify(newImages);

                  return (
                    <div key={key} className="p-3 even:bg-gray-50 rounded-lg">
                      <p className="font-semibold text-gray-800 mb-2">
                        {label}:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Khối ảnh cũ */}
                        <div
                          className={
                            hasImagesChanged ? "text-red-600" : "text-gray-500"
                          }
                        >
                          <p className="font-medium text-center mb-1">Cũ:</p>
                          <div className="flex flex-wrap gap-3 justify-center">
                            {oldImages.length > 0 ? (
                              oldImages.map((img, idx) => (
                                <a
                                  // href={img}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  key={`old-${idx}`}
                                >
                                  <img
                                    onClick={() => openPopup(img)}
                                    src={img}
                                    alt="Ảnh cũ"
                                    className="w-20 h-20 cursor-pointer object-cover rounded-md border-2 hover:opacity-80 transition-opacity"
                                  />
                                </a>
                              ))
                            ) : (
                              <p className="text-gray-500 italic">Không có.</p>
                            )}
                          </div>
                        </div>
                        {/* Khối ảnh mới */}
                        <div
                          className={
                            hasImagesChanged
                              ? "text-green-700"
                              : "text-gray-500"
                          }
                        >
                          <p className="font-medium text-center mb-1">Mới:</p>
                          <div className="flex flex-wrap gap-3 justify-center">
                            {newImages.length > 0 ? (
                              newImages.map((img, idx) => (
                                <a
                                  // href={img}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  key={`new-${idx}`}
                                >
                                  <img
                                    onClick={() => openPopup(img)}
                                    src={img}
                                    alt="Ảnh mới"
                                    className={`w-20 h-20 cursor-pointer object-cover rounded-md border-2 hover:opacity-80 transition-opacity ${
                                      hasImagesChanged
                                        ? "border-green-300"
                                        : "border-gray-2300"
                                    }`}
                                  />
                                </a>
                              ))
                            ) : (
                              <p className="text-gray-500 italic">Không có.</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                // --- HIỂN THỊ CÁC TRƯỜNG TEXT ---
                const oldValue = popupData.oldData?.[key]?.value;
                const newValue = popupData.newData?.[key]?.value;
                const hasChanged =
                  JSON.stringify(oldValue) !== JSON.stringify(newValue);

                return (
                  <div
                    key={key}
                    className="grid grid-cols-1 md:grid-cols-3 gap-x-4 p-3 even:bg-gray-50 rounded-lg items-center"
                  >
                    <p className="font-semibold text-gray-800 md:col-span-1">
                      {label}:
                    </p>

                    {popupData.actionType === "add" ? (
                      <p className="text-gray-900 break-words md:col-span-2">
                        {newValue || (
                          <span className="text-gray-400 italic">Chưa có</span>
                        )}
                      </p>
                    ) : (
                      <>
                        {/* Cột giá trị CŨ */}
                        <p
                          className={`break-words md:col-span-1 ${
                            hasChanged ? "text-red-700" : "text-gray-500"
                          }`}
                        >
                          <b className="font-medium font-semibold text-gray-500 no-underline">
                            Cũ:{" "}
                          </b>
                          {oldValue || <span className="italic">Chưa có</span>}
                        </p>

                        {/* Cột giá trị MỚI */}
                        <p
                          className={`font-medium break-words md:col-span-1 ${
                            hasChanged ? "text-green-700" : "text-gray-500"
                          }`}
                        >
                          <b className="font-medium font-semibold text-gray-500">
                            Mới:{" "}
                          </b>
                          {newValue || <span className="italic">Chưa có</span>}
                        </p>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-8 text-right">
              <button
                onClick={closePopupDetail}
                className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition cursor-pointer shadow-md"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
      <ImagePopup imageUrl={selectedImage} onClose={closePopup} />
    </div>
  );
};

export default PendingPerson;
