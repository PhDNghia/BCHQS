import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
// Giả sử bạn có các component này
import LoadingButton from "../components/LoadButton.jsx";
import ImagePopup from "../components/ImagePopup.jsx";
import { assets } from "../assets/assets.js";
import { useImagePopup } from "../hooks/useImagePopup.js";

const DetailPerson = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [person, setPerson] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [imageGet, setImageGet] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const { selectedImage, openPopup, closePopup } = useImagePopup();
  const [errors, setErrors] = useState({});

  const backendUrl = "http://localhost:4000"; // Thay đổi nếu cần

  useEffect(() => {
    const fetchDetailPerson = async () => {
      try {
        const response = await axios.post(
          `${backendUrl}/api/person/single`,
          { personId: id },
          { headers: { token } }
        );
        if (response.data.success) {
          setPerson(response.data.person);
          setImageGet(response.data.person.image?.value || []);
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
    if (id && token) {
      fetchDetailPerson();
    }
  }, [id, token]);

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
    return null;
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    const error = getValidationError(name, value);
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleValueChange = (e, fieldName) => {
    setPerson((prev) => ({
      ...prev,
      [fieldName]: { ...prev[fieldName], value: e.target.value },
    }));
  };

  const handleEditableChange = (e, fieldName) => {
    setPerson((prev) => ({
      ...prev,
      [fieldName]: { ...(prev[fieldName] || {}), editable: e.target.checked },
    }));
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
      const error = getValidationError(field, person[field]?.value);
      if (error) {
        newErrors[field] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Vui lòng kiểm tra lại các thông tin đã nhập.",
      });
      return;
    }
    setIsLoading(true);

    const formData = new FormData();
    const updateData = {};
    const fields = [
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
      "fatherInfo",
      "motherInfo",
      "wife",
      "children",
      "siblings",
      "education",
      "phone",
      "category",
      "categoryReason",
      "gmailUser",
      "image",
    ];

    fields.forEach((field) => {
      if (person[field]) {
        updateData[field] = {
          value: person[field].value,
          editable: person[field].editable || false,
        };
      }
    });

    formData.append("person", JSON.stringify(updateData));
    formData.append("id", id);
    if (deletedImages.length > 0) {
      formData.append("deletedImages", JSON.stringify(deletedImages));
    }
    newImages.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const response = await axios.post(
        `${backendUrl}/api/person/update`,
        formData,
        {
          headers: { token, "Content-Type": "multipart/form-data" },
        }
      );
      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Cập nhật thành công!",
          timer: 1500,
          showConfirmButton: false,
        });
        navigate("/list-person");
      } else {
        const errorMessage = response.data.details
          ? response.data.details.join("\n")
          : response.data.message;
        Swal.fire({ icon: "error", title: "Lỗi!", text: errorMessage });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.details
        ? error.response.data.details.join("\n")
        : error.response?.data?.message || error.message;
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        html: `<div style="text-align: left; white-space: pre-wrap;">${errorMessage}</div>`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddImage = (e) => {
    if (e.target.files[0] && imageGet.length < 10) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      setNewImages([...newImages, file]);
      setImageGet([...imageGet, previewUrl]);
    }
  };

  const handleDeleteImage = (imgToDelete) => {
    setImageGet(imageGet.filter((img) => img !== imgToDelete));
    if (imgToDelete.startsWith("blob:")) {
      setNewImages(
        newImages.filter((file) => URL.createObjectURL(file) !== imgToDelete)
      );
    } else {
      setDeletedImages([...deletedImages, imgToDelete]);
    }
  };

  const calculateEmptySlots = () => 10 - imageGet.length;

  return (
    <div>
      <div className="max-w-[100%]">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">
            Thông tin của {person.name?.value}
          </h1>
          <button
            onClick={() => navigate("/list-person")}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Trở về
          </button>
        </div>

        <form onSubmit={onSubmitHandler} noValidate>
          {/* Hàng 1 */}
          <div className="flex flex-wrap gap-4 mt-2">
            <div className="flex-1 min-w-[calc(33.333%_-_1rem)]">
              <div className="flex items-center gap-2 mb-2">
                <input
                  className="cursor-pointer"
                  type="checkbox"
                  checked={person.name?.editable || false}
                  onChange={(e) => handleEditableChange(e, "name")}
                />
                <b>Họ và tên</b>
              </div>
              <input
                name="name"
                className={`w-full border rounded px-3 py-2 ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                value={person.name?.value || ""}
                onChange={(e) => handleValueChange(e, "name")}
                onBlur={handleBlur}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>
            <div className="flex-1 min-w-[calc(33.333%_-_1rem)]">
              <div className="flex items-center gap-2 mb-2">
                <input
                  className="cursor-pointer"
                  type="checkbox"
                  checked={person.birth?.editable || false}
                  onChange={(e) => handleEditableChange(e, "birth")}
                />
                <b>Ngày sinh</b>
              </div>
              <input
                name="birth"
                className={`w-full border rounded px-3 py-2 ${
                  errors.birth ? "border-red-500" : "border-gray-300"
                }`}
                value={person.birth?.value || ""}
                onChange={(e) => handleValueChange(e, "birth")}
                onBlur={handleBlur}
                placeholder="dd/MM/yyyy"
              />
              {errors.birth && (
                <p className="text-red-500 text-sm mt-1">{errors.birth}</p>
              )}
            </div>
            <div className="flex-1 min-w-[calc(33.333%_-_1rem)]">
              <div className="flex items-center gap-2 mb-2">
                <input
                  className="cursor-pointer"
                  type="checkbox"
                  checked={person.sex?.editable || false}
                  onChange={(e) => handleEditableChange(e, "sex")}
                />
                <b>Giới tính</b>
              </div>
              <select
                name="sex"
                className={`w-full border rounded px-3 py-2 ${
                  errors.sex ? "border-red-500" : "border-gray-300"
                }`}
                value={person.sex?.value || ""}
                onChange={(e) => handleValueChange(e, "sex")}
                onBlur={handleBlur}
              >
                <option>Nam</option>
                <option>Nữ</option>
                <option>Khác</option>
              </select>
              {errors.sex && (
                <p className="text-red-500 text-sm mt-1">{errors.sex}</p>
              )}
            </div>
          </div>

          {/* Hàng 2 */}
          <div className="flex flex-wrap gap-4 mt-2">
            <div className="flex-1 min-w-[calc(33.333%_-_1rem)]">
              <div className="flex items-center gap-2 mb-2">
                <input
                  className="cursor-pointer"
                  type="checkbox"
                  checked={person.idNumber?.editable || false}
                  onChange={(e) => handleEditableChange(e, "idNumber")}
                />
                <b>Căn cước công dân</b>
              </div>
              <input
                name="idNumber"
                className={`w-full border rounded px-3 py-2 ${
                  errors.idNumber ? "border-red-500" : "border-gray-300"
                }`}
                value={person.idNumber?.value || ""}
                onChange={(e) => handleValueChange(e, "idNumber")}
                onBlur={handleBlur}
              />
              {errors.idNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.idNumber}</p>
              )}
            </div>
            <div className="flex-1 min-w-[calc(33.333%_-_1rem)]">
              <div className="flex items-center gap-2 mb-2">
                <input
                  className="cursor-pointer"
                  type="checkbox"
                  checked={person.occupation?.editable || false}
                  onChange={(e) => handleEditableChange(e, "occupation")}
                />
                <b>Nghề nghiệp</b>
              </div>
              <input
                name="occupation"
                className={`w-full border rounded px-3 py-2 ${
                  errors.occupation ? "border-red-500" : "border-gray-300"
                }`}
                value={person.occupation?.value || ""}
                onChange={(e) => handleValueChange(e, "occupation")}
                onBlur={handleBlur}
              />
              {errors.occupation && (
                <p className="text-red-500 text-sm mt-1">{errors.occupation}</p>
              )}
            </div>
            <div className="flex-1 min-w-[calc(33.333%_-_1rem)]">
              <div className="flex items-center gap-2 mb-2">
                <input
                  className="cursor-pointer"
                  type="checkbox"
                  checked={person.phone?.editable || false}
                  onChange={(e) => handleEditableChange(e, "phone")}
                />
                <b>Số điện thoại</b>
              </div>
              <input
                name="phone"
                className={`w-full border rounded px-3 py-2 ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                }`}
                value={person.phone?.value || ""}
                onChange={(e) => handleValueChange(e, "phone")}
                onBlur={handleBlur}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>
          </div>

          {/* Hàng 3 */}
          <div className="flex flex-wrap gap-4 mt-2">
            <div className="flex-1 min-w-[calc(50%_-_0.5rem)]">
              <div className="flex items-center gap-2 mb-2">
                <input
                  className="cursor-pointer"
                  type="checkbox"
                  checked={person.permanentAddress?.editable || false}
                  onChange={(e) => handleEditableChange(e, "permanentAddress")}
                />
                <b>Nơi thường trú</b>
              </div>
              <input
                name="permanentAddress"
                className={`w-full border rounded px-3 py-2 ${
                  errors.permanentAddress ? "border-red-500" : "border-gray-300"
                }`}
                value={person.permanentAddress?.value || ""}
                onChange={(e) => handleValueChange(e, "permanentAddress")}
                onBlur={handleBlur}
              />
              {errors.permanentAddress && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.permanentAddress}
                </p>
              )}
            </div>
            <div className="flex-1 min-w-[calc(50%_-_0.5rem)]">
              <div className="flex items-center gap-2 mb-2">
                <input
                  className="cursor-pointer"
                  type="checkbox"
                  checked={person.temporaryAddress?.editable || false}
                  onChange={(e) => handleEditableChange(e, "temporaryAddress")}
                />
                <b>Nơi tạm trú</b>
              </div>
              <input
                name="temporaryAddress"
                className={`w-full border rounded px-3 py-2 ${
                  errors.temporaryAddress ? "border-red-500" : "border-gray-300"
                }`}
                value={person.temporaryAddress?.value || ""}
                onChange={(e) => handleValueChange(e, "temporaryAddress")}
                onBlur={handleBlur}
              />
              {errors.temporaryAddress && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.temporaryAddress}
                </p>
              )}
            </div>
          </div>

          {/* Hàng 4 */}
          <div className="flex flex-wrap gap-4 mt-2">
            <div className="flex-1 min-w-[calc(50%_-_0.5rem)]">
              <div className="flex items-center gap-2 mb-2">
                <input
                  className="cursor-pointer"
                  type="checkbox"
                  checked={person.ethnicity?.editable || false}
                  onChange={(e) => handleEditableChange(e, "ethnicity")}
                />
                <b>Dân tộc</b>
              </div>
              <input
                name="ethnicity"
                className={`w-full border rounded px-3 py-2 ${
                  errors.ethnicity ? "border-red-500" : "border-gray-300"
                }`}
                value={person.ethnicity?.value || ""}
                onChange={(e) => handleValueChange(e, "ethnicity")}
                onBlur={handleBlur}
              />
              {errors.ethnicity && (
                <p className="text-red-500 text-sm mt-1">{errors.ethnicity}</p>
              )}
            </div>
            <div className="flex-1 min-w-[calc(50%_-_0.5rem)]">
              <div className="flex items-center gap-2 mb-2">
                <input
                  className="cursor-pointer"
                  type="checkbox"
                  checked={person.religion?.editable || false}
                  onChange={(e) => handleEditableChange(e, "religion")}
                />
                <b>Tôn giáo</b>
              </div>
              <input
                name="religion"
                className={`w-full border rounded px-3 py-2 ${
                  errors.religion ? "border-red-500" : "border-gray-300"
                }`}
                value={person.religion?.value || ""}
                onChange={(e) => handleValueChange(e, "religion")}
                onBlur={handleBlur}
              />
              {errors.religion && (
                <p className="text-red-500 text-sm mt-1">{errors.religion}</p>
              )}
            </div>
          </div>

          {/* Hàng 5 */}
          <div className="flex flex-wrap gap-4 mt-2">
            <div className="flex-1 min-w-[calc(50%_-_0.5rem)]">
              <div className="flex items-center gap-2 mb-2">
                <input
                  className="cursor-pointer"
                  type="checkbox"
                  checked={person.educationLevel?.editable || false}
                  onChange={(e) => handleEditableChange(e, "educationLevel")}
                />
                <b>Trình độ học vấn</b>
              </div>
              <input
                name="educationLevel"
                className={`w-full border rounded px-3 py-2 ${
                  errors.educationLevel ? "border-red-500" : "border-gray-300"
                }`}
                value={person.educationLevel?.value || ""}
                onChange={(e) => handleValueChange(e, "educationLevel")}
                onBlur={handleBlur}
              />
              {errors.educationLevel && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.educationLevel}
                </p>
              )}
            </div>
            <div className="flex-1 min-w-[calc(50%_-_0.5rem)]">
              <div className="flex items-center gap-2 mb-2">
                <input
                  className="cursor-pointer"
                  type="checkbox"
                  checked={person.professionalLevel?.editable || false}
                  onChange={(e) => handleEditableChange(e, "professionalLevel")}
                />
                <b>Trình độ chuyên môn</b>
              </div>
              <input
                name="professionalLevel"
                className={`w-full border rounded px-3 py-2 ${
                  errors.professionalLevel
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                value={person.professionalLevel?.value || ""}
                onChange={(e) => handleValueChange(e, "professionalLevel")}
                onBlur={handleBlur}
              />
              {errors.professionalLevel && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.professionalLevel}
                </p>
              )}
            </div>
          </div>

          {/* Hàng 6 */}
          <div className="flex flex-wrap gap-4 mt-2">
            <div className="flex-1 min-w-[calc(50%_-_0.5rem)]">
              <div className="flex items-center gap-2 mb-2">
                <input
                  className="cursor-pointer"
                  type="checkbox"
                  checked={person.fatherInfo?.editable || false}
                  onChange={(e) => handleEditableChange(e, "fatherInfo")}
                />
                <b>Thông tin cha</b>
              </div>
              <input
                name="fatherInfo"
                className={`w-full border rounded px-3 py-2 ${
                  errors.fatherInfo ? "border-red-500" : "border-gray-300"
                }`}
                value={person.fatherInfo?.value || ""}
                onChange={(e) => handleValueChange(e, "fatherInfo")}
                onBlur={handleBlur}
              />
              {errors.fatherInfo && (
                <p className="text-red-500 text-sm mt-1">{errors.fatherInfo}</p>
              )}
            </div>
            <div className="flex-1 min-w-[calc(50%_-_0.5rem)]">
              <div className="flex items-center gap-2 mb-2">
                <input
                  className="cursor-pointer"
                  type="checkbox"
                  checked={person.motherInfo?.editable || false}
                  onChange={(e) => handleEditableChange(e, "motherInfo")}
                />
                <b>Thông tin mẹ</b>
              </div>
              <input
                name="motherInfo"
                className={`w-full border rounded px-3 py-2 ${
                  errors.motherInfo ? "border-red-500" : "border-gray-300"
                }`}
                value={person.motherInfo?.value || ""}
                onChange={(e) => handleValueChange(e, "motherInfo")}
                onBlur={handleBlur}
              />
              {errors.motherInfo && (
                <p className="text-red-500 text-sm mt-1">{errors.motherInfo}</p>
              )}
            </div>
          </div>

          {/* Hàng 7 */}
          <div className="flex flex-wrap gap-4 mt-2">
            <div className="flex-1 min-w-[calc(50%_-_0.5rem)]">
              <div className="flex items-center gap-2 mb-2">
                <input
                  className="cursor-pointer"
                  type="checkbox"
                  checked={person.wife?.editable || false}
                  onChange={(e) => handleEditableChange(e, "wife")}
                />
                <b>Thông tin vợ</b>
              </div>
              <input
                name="wife"
                className={`w-full border rounded px-3 py-2 ${
                  errors.wife ? "border-red-500" : "border-gray-300"
                }`}
                value={person.wife?.value || ""}
                onChange={(e) => handleValueChange(e, "wife")}
                onBlur={handleBlur}
              />
              {errors.wife && (
                <p className="text-red-500 text-sm mt-1">{errors.wife}</p>
              )}
            </div>
            <div className="flex-1 min-w-[calc(50%_-_0.5rem)]">
              <div className="flex items-center gap-2 mb-2">
                <input
                  className="cursor-pointer"
                  type="checkbox"
                  checked={person.children?.editable || false}
                  onChange={(e) => handleEditableChange(e, "children")}
                />
                <b>Thông tin con</b>
              </div>
              <input
                name="children"
                className={`w-full border rounded px-3 py-2 ${
                  errors.children ? "border-red-500" : "border-gray-300"
                }`}
                value={person.children?.value || ""}
                onChange={(e) => handleValueChange(e, "children")}
                onBlur={handleBlur}
              />
              {errors.children && (
                <p className="text-red-500 text-sm mt-1">{errors.children}</p>
              )}
            </div>
          </div>

          {/* Hàng 8 - Textarea */}
          <div className="flex flex-wrap gap-4 mt-2">
            <div className="flex-1 min-w-[calc(50%_-_0.5rem)]">
              <div className="flex items-center gap-2 mb-2">
                <input
                  className="cursor-pointer"
                  type="checkbox"
                  checked={person.education?.editable || false}
                  onChange={(e) => handleEditableChange(e, "education")}
                />
                <b>Quá trình học tập</b>
              </div>
              <textarea
                name="education"
                className={`w-full border rounded px-3 py-2 min-h-[120px] ${
                  errors.education ? "border-red-500" : "border-gray-300"
                }`}
                value={person.education?.value || ""}
                onChange={(e) => handleValueChange(e, "education")}
                onBlur={handleBlur}
              />
              {errors.education && (
                <p className="text-red-500 text-sm mt-1">{errors.education}</p>
              )}
            </div>
            <div className="flex-1 min-w-[calc(50%_-_0.5rem)]">
              <div className="flex items-center gap-2 mb-2">
                <input
                  className="cursor-pointer"
                  type="checkbox"
                  checked={person.siblings?.editable || false}
                  onChange={(e) => handleEditableChange(e, "siblings")}
                />
                <b>Thông tin anh, chị, em ruột</b>
              </div>
              <textarea
                name="siblings"
                className={`w-full border rounded px-3 py-2 min-h-[120px] ${
                  errors.siblings ? "border-red-500" : "border-gray-300"
                }`}
                value={person.siblings?.value || ""}
                onChange={(e) => handleValueChange(e, "siblings")}
                onBlur={handleBlur}
              />
              {errors.siblings && (
                <p className="text-red-500 text-sm mt-1">{errors.siblings}</p>
              )}
            </div>
          </div>

          {/* Hàng 9 - Admin fields */}
          <div className="flex flex-wrap gap-4 mt-5">
            <div className="flex-1 min-w-[calc(33.333%_-_1rem)]">
              <div className="flex items-center gap-2 mb-2">
                <input
                  className="cursor-pointer"
                  type="checkbox"
                  checked={person.category?.editable || false}
                  onChange={(e) => handleEditableChange(e, "category")}
                />
                <b>Phân loại</b>
              </div>
              <select
                name="category"
                className={`w-full border rounded px-3 py-2 ${
                  errors.category ? "border-red-500" : "border-gray-300"
                }`}
                value={person.category?.value || ""}
                onChange={(e) => handleValueChange(e, "category")}
                onBlur={handleBlur}
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
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category}</p>
              )}
            </div>
            <div className="flex-1 min-w-[calc(33.333%_-_1rem)]">
              <div className="flex items-center gap-2 mb-2">
                <input
                  className="cursor-pointer"
                  type="checkbox"
                  checked={person.categoryReason?.editable || false}
                  onChange={(e) => handleEditableChange(e, "categoryReason")}
                />
                <b>Lý do phân loại</b>
              </div>
              <input
                name="categoryReason"
                className={`w-full border rounded px-3 py-2 ${
                  errors.categoryReason ? "border-red-500" : "border-gray-300"
                }`}
                value={person.categoryReason?.value || ""}
                onChange={(e) => handleValueChange(e, "categoryReason")}
                onBlur={handleBlur}
              />
              {errors.categoryReason && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.categoryReason}
                </p>
              )}
            </div>
            <div className="flex-1 min-w-[calc(33.333%_-_1rem)]">
              <div className="flex items-center gap-2 mb-2">
                <input
                  className="cursor-pointer"
                  type="checkbox"
                  checked={person.gmailUser?.editable || false}
                  onChange={(e) => handleEditableChange(e, "gmailUser")}
                />
                <b>Gmail</b>
              </div>
              <input
                name="gmailUser"
                className={`w-full border rounded px-3 py-2 ${
                  errors.gmailUser ? "border-red-500" : "border-gray-300"
                }`}
                value={person.gmailUser?.value || ""}
                onChange={(e) => handleValueChange(e, "gmailUser")}
                onBlur={handleBlur}
              />
              {errors.gmailUser && (
                <p className="text-red-500 text-sm mt-1">{errors.gmailUser}</p>
              )}
            </div>
          </div>

          {/* Hàng 10 - Hình ảnh */}
          <div className="flex flex-wrap gap-4 mt-5">
            <div className="w-full">
              <div className="flex items-center gap-2 mb-2">
                <input
                  className="cursor-pointer"
                  type="checkbox"
                  checked={person.image?.editable || false}
                  onChange={(e) => handleEditableChange(e, "image")}
                />
                <b>Hình ảnh</b>
              </div>
              <div className="flex flex-wrap gap-2">
                {imageGet.map((img, index) => (
                  <div key={index} className="relative w-20 h-20">
                    <img
                      src={img}
                      alt={`img-${index}`}
                      className="w-full h-full object-cover border-2 border-gray-300 rounded-lg cursor-pointer"
                      onClick={() => openPopup(img)}
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(img)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {Array.from({ length: calculateEmptySlots() }).map(
                  (_, index) => (
                    <label
                      key={`add-${index}`}
                      className="w-20 h-20 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500"
                    >
                      <img className="w-1/2" src={assets.upload_area} alt="" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAddImage}
                      />
                    </label>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="w-full flex justify-center pt-4">
            <LoadingButton
              isLoading={isLoading}
              className="w-[60%] cursor-pointer bg-blue-600 text-white hover:bg-blue-700"
              type="submit"
            >
              Cập nhật
            </LoadingButton>
          </div>
        </form>
      </div>
      <ImagePopup imageUrl={selectedImage} onClose={closePopup} />
    </div>
  );
};

export default DetailPerson;
