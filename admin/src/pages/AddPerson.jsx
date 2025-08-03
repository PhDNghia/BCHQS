import React, { useState } from "react";
import Swal from "sweetalert2";
import { assets } from "../assets/assets.js";
import { backendUrl } from "../App";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingButton from "../components/LoadButton.jsx";

// mở popup xem hình
import ImagePopup from "../components/ImagePopup";
import { useImagePopup } from "../hooks/useImagePopup.js";

const AddPerson = ({ token }) => {
  const [images, setImages] = useState(Array(10).fill(null));
  const [isLoading, setIsLoading] = useState(false);

  // State cho các trường input
  const [data, setData] = useState({
    name: "",
    birth: "",
    sex: "Nam",
    idNumber: "",
    occupation: "",
    permanentAddress: "",
    temporaryAddress: "",
    wife: "",
    children: "",
    ethnicity: "Kinh",
    religion: "Không",
    educationLevel: "",
    professionalLevel: "",
    fatherInfo: "",
    motherInfo: "",
    siblings: "",
    education: "",
    phone: "",
    category: "Đủ điều kiện",
    categoryReason: "",
    gmailUser: "",
  });

  // State mới để lưu lỗi validation
  const [errors, setErrors] = useState({});

  const { selectedImage, openPopup, closePopup } = useImagePopup();
  const navigate = useNavigate();

  // --- HÀM VALIDATE ---
  const getValidationError = (fieldName, value) => {
    const requiredFields = [
      "name",
      "birth",
      "sex",
      "idNumber",
      "occupation",
      "permanentAddress",
      "temporaryAddress",
      "ethnicity",
      "religion",
      "educationLevel",
      "professionalLevel",
      "education",
      "phone",
      "category",
      "categoryReason",
      "gmailUser",
    ];

    if (requiredFields.includes(fieldName) && !value?.trim()) {
      return "Trường này là bắt buộc.";
    }

    switch (fieldName) {
      case "birth":
        if (value) {
          const parts = value.split("/");
          if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value) || parts.length !== 3) {
            return "Định dạng phải là dd/MM/yyyy.";
          }
          const day = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10);
          const year = parseInt(parts[2], 10);

          if (year < 1950 || year > 2025) {
            return "Năm sinh phải từ 1950 đến 2025.";
          }
          if (month < 1 || month > 12) {
            return "Tháng phải từ 01 đến 12.";
          }
          if (day < 1 || day > 31) {
            return "Ngày phải từ 01 đến 31.";
          }
          // Kiểm tra ngày hợp lệ (ví dụ: không có ngày 31/02)
          const testDate = new Date(year, month - 1, day);
          if (
            testDate.getFullYear() !== year ||
            testDate.getMonth() + 1 !== month ||
            testDate.getDate() !== day
          ) {
            return "Ngày sinh không hợp lệ.";
          }
        }
        break;
      case "idNumber":
        if (value && !/(^\d{9}$)|(^\d{12}$)/.test(value))
          return "CCCD phải có 9 hoặc 12 chữ số.";
        break;
      case "phone":
        if (value && !/^(0?)(3|5|7|8|9|1[2|6|8|9])+([0-9]{8})$/.test(value))
          return "Số điện thoại không hợp lệ.";
        break;
      case "gmailUser":
        if (value && !/\S+@\S+\.\S+/.test(value)) return "Email không hợp lệ.";
        break;
      case "educationLevel":
        if (value && !/^(0?[1-9]|1[0-2])\/12$/.test(value))
          return "Định dạng phải là XX/12 (ví dụ: 12/12).";
        break;
      default:
        break;
    }
    return null; // Không có lỗi
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    const error = getValidationError(name, value);
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleValueChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    const fieldsToValidate = [
      "name",
      "birth",
      "sex",
      "idNumber",
      "occupation",
      "permanentAddress",
      "temporaryAddress",
      "ethnicity",
      "religion",
      "educationLevel",
      "professionalLevel",
      "education",
      "phone",
      "category",
      "categoryReason",
      "gmailUser",
    ];

    fieldsToValidate.forEach((field) => {
      const error = getValidationError(field, data[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Vui lòng kiểm tra lại các thông tin đã nhập.",
      });
      return;
    }
    setIsLoading(true);

    try {
      const formData = new FormData();
      images.forEach((img, index) => {
        if (img) {
          formData.append(`image${index + 1}`, img);
        }
      });

      const personData = {};
      for (const key in data) {
        personData[key] = { value: data[key], editable: true };
      }
      personData.date = { value: new Date().toISOString(), editable: false };
      personData.image = { value: [], editable: true };

      formData.append("person", JSON.stringify(personData));

      const response = await axios.post(
        backendUrl + "/api/person/add",
        formData,
        { headers: { token } }
      );

      if (response.data.success) {
        Swal.fire({ title: "Thêm thành công!", icon: "success" });
        navigate("/list-person");
      } else {
        Swal.fire({ icon: "error", title: "Lỗi", text: response.data.message });
      }
    } catch (error) {
      const message = error.response?.data?.message || "Đã có lỗi xảy ra.";
      const details = error.response?.data?.details;
      let errorContent = message;
      if (details && Array.isArray(details) && details.length > 0) {
        const detailList = details.join("<br>");
        errorContent = `<div style="text-align: center; margin-top: 10px;">${detailList}</div>`;
      }
      Swal.fire({ icon: "error", title: "Lỗi", html: errorContent });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} noValidate>
      {/* Khối tải ảnh */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-5">
          <b className="mb-3 block">Tải ảnh lên</b>
          <div className="flex gap-10 mb-2 flex-wrap">
            {images.map((img, index) => (
              <div key={index} className="relative w-20 h-20">
                <label
                  htmlFor={`image-${index}`}
                  className="w-full h-full flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition duration-200 overflow-hidden"
                >
                  <img
                    className="w-full h-full object-cover"
                    src={!img ? assets.upload_area : URL.createObjectURL(img)}
                    alt={`Ảnh ${index + 1}`}
                  />
                  <input
                    type="file"
                    hidden
                    id={`image-${index}`}
                    onChange={(e) => {
                      const file = e.target.files[0] || null;
                      const newImages = [...images];
                      newImages[index] = file;
                      setImages(newImages);
                    }}
                    accept="image/*"
                  />
                </label>
                {img && (
                  <button
                    type="button"
                    onClick={() => {
                      const newImages = [...images];
                      newImages[index] = null;
                      setImages(newImages);
                    }}
                    className="absolute cursor-pointer top-[-5px] right-[-5px] bg-red-600 text-white w-4 h-4 rounded-full flex items-center justify-center text-xs hover:bg-red-700"
                    title="Xoá ảnh"
                  >
                    X
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="flex-2">
          <b className="mb-3 block">Gmail</b>
          <input
            name="gmailUser"
            onChange={handleValueChange}
            onBlur={handleBlur}
            value={data.gmailUser}
            className={`w-full px-3 py-2 border rounded ${
              errors.gmailUser ? "border-red-500" : "border-gray-300"
            }`}
            type="email"
            placeholder="abc@gmail.com"
          />
          {errors.gmailUser && (
            <p className="text-red-500 text-sm mt-1">{errors.gmailUser}</p>
          )}
        </div>
      </div>

      {/* Các input còn lại */}
      <div className="flex gap-4 mt-2">
        <div className="flex-2">
          <b className="mb-2 block">Họ và tên</b>
          <input
            name="name"
            onChange={handleValueChange}
            onBlur={handleBlur}
            value={data.name}
            className={`w-full px-3 py-2 border rounded ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
            type="text"
            placeholder="Trần Văn A"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>
        <div className="flex-1">
          <b className="mb-2 block">Ngày sinh</b>
          <input
            name="birth"
            onChange={handleValueChange}
            onBlur={handleBlur}
            value={data.birth}
            className={`w-full px-3 py-2 border rounded ${
              errors.birth ? "border-red-500" : "border-gray-300"
            }`}
            type="text"
            placeholder="01/01/2000"
          />
          {errors.birth && (
            <p className="text-red-500 text-sm mt-1">{errors.birth}</p>
          )}
        </div>
        <div className="flex-1">
          <b className="mb-2 block">Giới tính</b>
          <select
            name="sex"
            onChange={handleValueChange}
            onBlur={handleBlur}
            className="w-full px-3 py-2 border rounded cursor-pointer"
            value={data.sex}
          >
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mt-2">
        <div className="flex-1 min-w-[200px]">
          <b className="mb-2 block">Căn cước công dân</b>
          <input
            name="idNumber"
            onChange={handleValueChange}
            onBlur={handleBlur}
            value={data.idNumber}
            className={`w-full px-3 py-2 border rounded ${
              errors.idNumber ? "border-red-500" : "border-gray-300"
            }`}
            type="text"
            placeholder="092099xxxxxx"
          />
          {errors.idNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.idNumber}</p>
          )}
        </div>
        <div className="flex-[4] min-w-auto">
          <b className="mb-2 block">Nghề nghiệp</b>
          <input
            name="occupation"
            onChange={handleValueChange}
            onBlur={handleBlur}
            value={data.occupation}
            className={`w-full px-3 py-2 border rounded ${
              errors.occupation ? "border-red-500" : "border-gray-300"
            }`}
            type="text"
            placeholder="Công nhân - Lạc Tỷ 2"
          />
          {errors.occupation && (
            <p className="text-red-500 text-sm mt-1">{errors.occupation}</p>
          )}
        </div>
        <div className="flex-1 min-w-[100px]">
          <b className="mb-2 block">Dân tộc</b>
          <input
            name="ethnicity"
            onChange={handleValueChange}
            onBlur={handleBlur}
            value={data.ethnicity}
            className={`w-full px-3 py-2 border rounded ${
              errors.ethnicity ? "border-red-500" : "border-gray-300"
            }`}
            type="text"
          />
          {errors.ethnicity && (
            <p className="text-red-500 text-sm mt-1">{errors.ethnicity}</p>
          )}
        </div>
        <div className="flex-1 min-w-[100px]">
          <b className="mb-2 block">Tôn giáo</b>
          <input
            name="religion"
            onChange={handleValueChange}
            onBlur={handleBlur}
            value={data.religion}
            className={`w-full px-3 py-2 border rounded ${
              errors.religion ? "border-red-500" : "border-gray-300"
            }`}
            type="text"
          />
          {errors.religion && (
            <p className="text-red-500 text-sm mt-1">{errors.religion}</p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mt-2">
        <div className="flex-1">
          <b className="mb-2 block">Nơi thường trú</b>
          <input
            name="permanentAddress"
            onChange={handleValueChange}
            onBlur={handleBlur}
            value={data.permanentAddress}
            className={`w-full px-3 py-2 border rounded ${
              errors.permanentAddress ? "border-red-500" : "border-gray-300"
            }`}
            type="text"
          />
          {errors.permanentAddress && (
            <p className="text-red-500 text-sm mt-1">
              {errors.permanentAddress}
            </p>
          )}
        </div>
        <div className="flex-1">
          <b className="mb-2 block">Nơi tạm trú</b>
          <input
            name="temporaryAddress"
            onChange={handleValueChange}
            onBlur={handleBlur}
            value={data.temporaryAddress}
            className={`w-full px-3 py-2 border rounded ${
              errors.temporaryAddress ? "border-red-500" : "border-gray-300"
            }`}
            type="text"
          />
          {errors.temporaryAddress && (
            <p className="text-red-500 text-sm mt-1">
              {errors.temporaryAddress}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mt-2">
        <div className="flex-1">
          <b className="mb-2 block">Trình độ học vấn</b>
          <input
            name="educationLevel"
            onChange={handleValueChange}
            onBlur={handleBlur}
            value={data.educationLevel}
            className={`w-full px-3 py-2 border rounded ${
              errors.educationLevel ? "border-red-500" : "border-gray-300"
            }`}
            type="text"
            placeholder="12/12"
          />
          {errors.educationLevel && (
            <p className="text-red-500 text-sm mt-1">{errors.educationLevel}</p>
          )}
        </div>
        <div className="flex-[3]">
          <b className="mb-2 block">Trình độ chuyên môn</b>
          <input
            name="professionalLevel"
            onChange={handleValueChange}
            onBlur={handleBlur}
            value={data.professionalLevel}
            className={`w-full px-3 py-2 border rounded ${
              errors.professionalLevel ? "border-red-500" : "border-gray-300"
            }`}
            type="text"
            placeholder="ĐH Công nghệ thông tin || CĐ Thiết kế đồ họa"
          />
          {errors.professionalLevel && (
            <p className="text-red-500 text-sm mt-1">
              {errors.professionalLevel}
            </p>
          )}
        </div>
        <div className="flex-[2]">
          <b className="mb-2 block">Số điện thoại</b>
          <input
            name="phone"
            onChange={handleValueChange}
            onBlur={handleBlur}
            value={data.phone}
            className={`w-full px-3 py-2 border rounded ${
              errors.phone ? "border-red-500" : "border-gray-300"
            }`}
            type="text"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mt-2">
        <div className="flex-1">
          <b className="mb-2 block">Thông tin cha</b>
          <input
            name="fatherInfo"
            onChange={handleValueChange}
            onBlur={handleBlur}
            value={data.fatherInfo}
            className="w-full px-3 py-2 border rounded"
            type="text"
            placeholder="Trần Văn B, 19xx, Lao động tự do"
          />
        </div>
        <div className="flex-1">
          <b className="mb-2 block">Thông tin mẹ</b>
          <input
            name="motherInfo"
            onChange={handleValueChange}
            onBlur={handleBlur}
            value={data.motherInfo}
            className="w-full px-3 py-2 border rounded"
            type="text"
            placeholder="Phạm Thị C, 19xx, Nội trợ"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mt-2">
        <div className="flex-1">
          <b className="mb-2 block">Thông tin vợ</b>
          <input
            name="wife"
            onChange={handleValueChange}
            onBlur={handleBlur}
            value={data.wife}
            className="w-full px-3 py-2 border rounded"
            type="text"
            placeholder="Lê Thị M, 19xx, Nội trợ || Chưa có"
          />
        </div>
        <div className="flex-[1]">
          <b className="mb-2 block">Thông tin con</b>
          <input
            name="children"
            onChange={handleValueChange}
            onBlur={handleBlur}
            value={data.children}
            className="w-full px-3 py-2 border rounded"
            type="text"
            placeholder="Trần Văn N, 12 tháng tuổi || Chưa có"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mt-2">
        <div className="flex-1">
          <b className="mb-2 block">Thông tin anh chị em</b>
          <textarea
            name="siblings"
            onChange={handleValueChange}
            onBlur={handleBlur}
            value={data.siblings}
            className="w-full px-3 py-2 border rounded min-h-[120px] max-h-[300px]"
            placeholder="1. Anh: Trần Văn D, 19xx, Công nhân..."
          />
        </div>
        <div className="flex-1">
          <b className="mb-2 block">Quá trình học tập</b>
          <textarea
            name="education"
            onChange={handleValueChange}
            onBlur={handleBlur}
            value={data.education}
            className={`w-full px-3 py-2 border rounded min-h-[120px] max-h-[300px] ${
              errors.education ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Cấp 1: TH Thường Thạnh..."
          />
          {errors.education && (
            <p className="text-red-500 text-sm mt-1">{errors.education}</p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 my-4">
        <div className="flex-1">
          <b className="mb-2 block">Phân loại</b>
          <select
            name="category"
            onChange={handleValueChange}
            onBlur={handleBlur}
            className="w-full px-3 py-2 border rounded cursor-pointer"
            value={data.category}
          >
            <option>Đủ điều kiện</option>
            <option>Chưa gọi</option>
            <option>Tạm hoãn</option>
            <option>Hết tuổi</option>
            <option>Thiếu tuổi</option>
            <option>Giải ngạch</option>
            <option>Xuất ngũ</option>
            <option>Chuyển khẩu</option>
            <option>Cắt khỏi nguồn</option>
          </select>
        </div>
        <div className="flex-3">
          <b className="mb-2 block">Lý do</b>
          <input
            name="categoryReason"
            onChange={handleValueChange}
            onBlur={handleBlur}
            value={data.categoryReason}
            className={`w-full px-3 py-2 border rounded ${
              errors.categoryReason ? "border-red-500" : "border-gray-300"
            }`}
            type="text"
            placeholder="Nhập lý do của phân loại"
          />
          {errors.categoryReason && (
            <p className="text-red-500 text-sm mt-1">{errors.categoryReason}</p>
          )}
        </div>
      </div>

      <div className="w-full flex justify-center mt-4">
        <LoadingButton
          isLoading={isLoading}
          className="cursor-pointer bg-blue-600 text-white w-[60%] hover:bg-blue-700"
          type="submit"
        >
          Thêm
        </LoadingButton>
      </div>

      <ImagePopup imageUrl={selectedImage} onClose={closePopup} />
    </form>
  );
};

export default AddPerson;
