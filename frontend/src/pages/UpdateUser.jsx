import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { backendUrl } from "../App";
import LoadingButton from "../components/LoadButton";
import { assets } from "../assets/assets";

// mở popup xem hình
import ImagePopup from "../components/ImagePopup";
import { useImagePopup } from "../hooks/useImagePopup.js";

const UpdateUser = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  //popup image
  const { selectedImage, openPopup, closePopup } = useImagePopup();

  const [person, setPerson] = useState(() => {
    const saved = localStorage.getItem("person");
    return saved ? JSON.parse(saved) : {};
  });

  const [originalPerson] = useState(() => {
    const saved = localStorage.getItem("person");
    return saved ? JSON.parse(saved) : {};
  });

  const [images, setImages] = useState([]);

  const [deletedImageUrls, setDeletedImageUrls] = useState([]);

  useEffect(() => {
    const initialImages = (person.image?.value || []).map((url) => ({
      id: url,
      url: url,
      file: null,
    }));
    setImages(initialImages);
  }, [person.image]);

  const handleInputChange = (key, value) => {
    setPerson((prev) => ({
      ...prev,
      [key]: {
        ...(prev[key] || {}),
        value: value,
      },
    }));
  };

  const handleAddImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const newImage = {
      id: Date.now(),
      url: URL.createObjectURL(file),
      file: file,
    };

    setImages((prevImages) => [...prevImages, newImage]);
  };

  const handleDeleteImage = (imageToDelete) => {
    setImages((prevImages) =>
      prevImages.filter((img) => img.id !== imageToDelete.id)
    );

    if (!imageToDelete.file) {
      setDeletedImageUrls((prev) => [...prev, imageToDelete.url]);
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData();

    const newImageFiles = images
      .filter((img) => img.file)
      .map((img) => img.file);
    const keptOldImageUrls = images
      .filter((img) => !img.file)
      .map((img) => img.url);

    newImageFiles.forEach((file) => {
      formData.append("newImages", file);
    });

    const finalNewData = { ...person };
    finalNewData.image = {
      ...(person.image || {}),
      value: keptOldImageUrls,
    };

    formData.append("newData", JSON.stringify(finalNewData));
    formData.append("oldData", JSON.stringify(originalPerson));
    formData.append("deletedImages", JSON.stringify(deletedImageUrls));
    formData.append("actionType", "edit");
    formData.append(
      "gmailUser",
      JSON.stringify({ value: person.gmailUser.value })
    );
    formData.append("targetGmailUser", person.gmailUser.value);

    try {
      const response = await axios.post(
        `${backendUrl}/api/pending/create-pending`,
        formData,
        { headers: { token: token } }
      );

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Yêu cầu đã được gửi!",
          text: "Thông tin của bạn sẽ được quản trị viên duyệt.",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/check-gmail");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text:
          error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-[90%] p-4 sm:p-6 lg:p-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Cập nhật thông tin cá nhân
      </h2>
      <form onSubmit={onSubmitHandler} className="space-y-6">
        {/* --- KHỐI THÔNG TIN CÁ NHÂN --- */}
        <div className="p-4 border rounded-lg bg-white shadow-sm">
          <h3 className="text-lg font-semibold mb-4 border-b pb-2">
            Thông tin cơ bản
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-medium text-gray-700 mb-1 block">
                Họ và tên
              </label>
              <input
                className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
                value={person.name?.value || ""}
                onChange={(e) => handleInputChange("name", e.target.value)}
                disabled={!person.name?.editable}
              />
            </div>
            <div>
              <label className="font-medium text-gray-700 mb-1 block">
                Ngày sinh
              </label>
              <input
                className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
                value={person.birth?.value || ""}
                onChange={(e) => handleInputChange("birth", e.target.value)}
                disabled={!person.birth?.editable}
              />
            </div>
            <div>
              <label className="font-medium text-gray-700 mb-1 block">
                Giới tính
              </label>
              <select
                className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
                value={person.sex?.value || "Nam"}
                onChange={(e) => handleInputChange("sex", e.target.value)}
                disabled={!person.sex?.editable}
              >
                <option>Nam</option>
                <option>Nữ</option>
              </select>
            </div>
            <div>
              <label className="font-medium text-gray-700 mb-1 block">
                CCCD
              </label>
              <input
                className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
                value={person.idNumber?.value || ""}
                onChange={(e) => handleInputChange("idNumber", e.target.value)}
                disabled={!person.idNumber?.editable}
              />
            </div>
            <div>
              <label className="font-medium text-gray-700 mb-1 block">
                Dân tộc
              </label>
              <input
                className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
                value={person.ethnicity?.value || ""}
                onChange={(e) => handleInputChange("ethnicity", e.target.value)}
                disabled={!person.ethnicity?.editable}
              />
            </div>
            <div>
              <label className="font-medium text-gray-700 mb-1 block">
                Tôn giáo
              </label>
              <input
                className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
                value={person.religion?.value || ""}
                onChange={(e) => handleInputChange("religion", e.target.value)}
                disabled={!person.religion?.editable}
              />
            </div>
          </div>
        </div>

        {/* --- KHỐI THÔNG TIN LIÊN HỆ & NGHỀ NGHIỆP --- */}
        <div className="p-4 border rounded-lg bg-white shadow-sm">
          <h3 className="text-lg font-semibold mb-4 border-b pb-2">
            Liên hệ & Nghề nghiệp
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-medium text-gray-700 mb-1 block">
                Nghề nghiệp
              </label>
              <input
                className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
                value={person.occupation?.value || ""}
                onChange={(e) =>
                  handleInputChange("occupation", e.target.value)
                }
                disabled={!person.occupation?.editable}
              />
            </div>
            <div>
              <label className="font-medium text-gray-700 mb-1 block">
                Số điện thoại
              </label>
              <input
                className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
                value={person.phone?.value || ""}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                disabled={!person.phone?.editable}
              />
            </div>
            <div className="md:col-span-2">
              <label className="font-medium text-gray-700 mb-1 block">
                Địa chỉ thường trú
              </label>
              <input
                className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
                value={person.permanentAddress?.value || ""}
                onChange={(e) =>
                  handleInputChange("permanentAddress", e.target.value)
                }
                disabled={!person.permanentAddress?.editable}
              />
            </div>
            <div className="md:col-span-2">
              <label className="font-medium text-gray-700 mb-1 block">
                Địa chỉ tạm trú
              </label>
              <input
                className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
                value={person.temporaryAddress?.value || ""}
                onChange={(e) =>
                  handleInputChange("temporaryAddress", e.target.value)
                }
                disabled={!person.temporaryAddress?.editable}
              />
            </div>
          </div>
        </div>

        {/* --- KHỐI TRÌNH ĐỘ & HỌC VẤN --- */}
        <div className="p-4 border rounded-lg bg-white shadow-sm">
          <h3 className="text-lg font-semibold mb-4 border-b pb-2">
            Trình độ & Học vấn
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-medium text-gray-700 mb-1 block">
                Trình độ học vấn
              </label>
              <input
                className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
                value={person.educationLevel?.value || ""}
                onChange={(e) =>
                  handleInputChange("educationLevel", e.target.value)
                }
                disabled={!person.educationLevel?.editable}
              />
            </div>
            <div>
              <label className="font-medium text-gray-700 mb-1 block">
                Trình độ chuyên môn
              </label>
              <input
                className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
                value={person.professionalLevel?.value || ""}
                onChange={(e) =>
                  handleInputChange("professionalLevel", e.target.value)
                }
                disabled={!person.professionalLevel?.editable}
              />
            </div>
            <div className="md:col-span-2">
              <label className="font-medium text-gray-700 mb-1 block">
                Quá trình học tập
              </label>
              <textarea
                className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 min-h-[100px] disabled:bg-gray-100 disabled:cursor-not-allowed"
                value={person.education?.value || ""}
                onChange={(e) => handleInputChange("education", e.target.value)}
                disabled={!person.education?.editable}
              />
            </div>
          </div>
        </div>

        {/* --- KHỐI THÔNG TIN GIA ĐÌNH --- */}
        <div className="p-4 border rounded-lg bg-white shadow-sm">
          <h3 className="text-lg font-semibold mb-4 border-b pb-2">
            Thông tin gia đình
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-medium text-gray-700 mb-1 block">
                Thông tin cha
              </label>
              <input
                className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
                value={person.fatherInfo?.value || ""}
                onChange={(e) =>
                  handleInputChange("fatherInfo", e.target.value)
                }
                disabled={!person.fatherInfo?.editable}
              />
            </div>
            <div>
              <label className="font-medium text-gray-700 mb-1 block">
                Thông tin mẹ
              </label>
              <input
                className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
                value={person.motherInfo?.value || ""}
                onChange={(e) =>
                  handleInputChange("motherInfo", e.target.value)
                }
                disabled={!person.motherInfo?.editable}
              />
            </div>
            <div>
              <label className="font-medium text-gray-700 mb-1 block">
                Thông tin vợ/chồng
              </label>
              <input
                className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
                value={person.wife?.value || ""}
                onChange={(e) => handleInputChange("wife", e.target.value)}
                disabled={!person.wife?.editable}
              />
            </div>
            <div>
              <label className="font-medium text-gray-700 mb-1 block">
                Thông tin con
              </label>
              <input
                className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
                value={person.children?.value || ""}
                onChange={(e) => handleInputChange("children", e.target.value)}
                disabled={!person.children?.editable}
              />
            </div>
            <div className="md:col-span-2">
              <label className="font-medium text-gray-700 mb-1 block">
                Thông tin anh chị em
              </label>
              <textarea
                className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 min-h-[100px] disabled:bg-gray-100 disabled:cursor-not-allowed"
                value={person.siblings?.value || ""}
                onChange={(e) => handleInputChange("siblings", e.target.value)}
                disabled={!person.siblings?.editable}
              />
            </div>
          </div>
        </div>

        {/* --- KHỐI HÌNH ẢNH --- */}
        <div className="p-4 border rounded-lg bg-white shadow-sm">
          <h3 className="text-lg font-semibold mb-4 border-b pb-2">
            Hình ảnh giấy tờ
          </h3>
          <div className="flex flex-wrap gap-4 mt-2 p-2 border-gray-200 rounded-lg">
            {images.map((img, index) => (
              <div key={img.id} className="relative w-20 h-20">
                <img
                  src={img.url}
                  alt={`preview-${img.id}`}
                  className="w-full h-full object-cover rounded-md shadow-md cursor-pointer"
                  onLoad={() => {
                    if (img.file) {
                      URL.revokeObjectURL(img.url);
                    }
                  }}
                  onClick={() => {
                    // Kiểm tra nếu là file cục bộ, tạo URL tạm thời
                    const imageUrl = img.file
                      ? URL.createObjectURL(img.file)
                      : img.url;
                    openPopup([imageUrl]);
                  }}
                />
                {/* Điều kiện kép: Chỉ hiện nút xóa cho ảnh không phải đầu tiên */}
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      handleDeleteImage(img);
                    }}
                    className="absolute cursor-pointer -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
                    // Nút xóa cũng bị vô hiệu hóa theo trạng thái chung
                    disabled={!person.image?.editable}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            {/* Nút Upload mới */}
            {images.length < 10 && (
              <label
                className={`w-20 h-20 flex items-center justify-center border-2 border-dashed rounded-lg transition-colors 
        ${
          !person.image?.editable
            ? "cursor-not-allowed bg-gray-100 border-gray-200"
            : "cursor-pointer border-gray-300 hover:border-blue-500 hover:bg-blue-50"
        }`}
              >
                <img
                  src={assets.upload_area}
                  alt="upload"
                  className="w-8 h-8 opacity-70"
                />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAddImage}
                  // Nút upload bị vô hiệu hóa theo trạng thái chung
                  disabled={!person.image?.editable}
                />
              </label>
            )}
          </div>
        </div>

        <div className="w-full flex justify-center">
          <LoadingButton
            isLoading={isLoading}
            className="cursor-pointer bg-blue-600 text-white w-full hover:bg-blue-700"
            type="submit"
          >
            Gởi yêu cầu thay đổi thông tin
          </LoadingButton>
        </div>
      </form>
      <ImagePopup imageUrl={selectedImage} onClose={closePopup} />
    </div>
  );
};

export default UpdateUser;
