import React, { useState } from "react";
import Swal from "sweetalert2";
import { backendUrl } from "../App";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import LoadingButton from "../components/LoadButton.jsx";

const CreateUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();

  // Gom tất cả dữ liệu form vào một state object
  const [data, setData] = useState({
    name: "",
    birth: "",
    sex: "Nam",
    idNumber: "",
    occupation: "",
    permanentAddress: "",
    temporaryAddress: "",
    wife: "Chưa có",
    children: "Chưa có",
    ethnicity: "Kinh",
    religion: "Không",
    educationLevel: "",
    professionalLevel: "",
    fatherInfo: "",
    motherInfo: "",
    siblings: "",
    education: "",
    phone: "",
    image: [],
  });

  const [errors, setErrors] = useState({});

  const gmailDefault = user?.primaryEmailAddress?.emailAddress || "";

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

          if (year < 1950 || year > 2025)
            return "Năm sinh phải từ 1950 đến 2025.";
          if (month < 1 || month > 12) return "Tháng phải từ 01 đến 12.";
          if (day < 1 || day > 31) return "Ngày phải từ 01 đến 31.";
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
      case "educationLevel":
        if (value && !/^(0?[1-9]|1[0-2])\/12$/.test(value))
          return "Định dạng phải là XX/12.";
        break;
      default:
        break;
    }
    return null; // Không có lỗi
  };

  const handleBlur = (event) => {
    let { name, value } = event.target;

    if (name === "name") {
      const formattedName = value
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ");

      setData((prev) => ({ ...prev, [name]: formattedName }));
      value = formattedName;
    }

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
      const personData = {};
      // Lặp qua state 'data' để xây dựng object
      for (const key in data) {
        personData[key] = { value: data[key] };
      }
      // Thêm các trường mặc định
      personData.category = { value: "Đủ điều kiện" };
      personData.categoryReason = { value: "Đủ điều kiện khám đợt 1" };
      personData.gmailUser = { value: gmailDefault };
      personData.date = { value: new Date() };

      const formData = new FormData();
      formData.append("newData", JSON.stringify(personData));
      formData.append("gmailUser", JSON.stringify({ value: gmailDefault }));
      formData.append("actionType", "add");
      formData.append("deletedImages", JSON.stringify([]));

      const res = await axios.post(
        `${backendUrl}/api/pending/create-pending`,
        formData
      );

      if (res.data.success) {
        Swal.fire({
          title: "Gửi yêu cầu thành công!",
          text: "Thông tin của bạn sẽ được duyệt bởi quản trị viên.",
          icon: "success",
        });
        navigate("/");
      } else {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: res.data.message || "Gửi thất bại!",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.message || "Có lỗi xảy ra",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto bg-gray-50">
      <div className="w-[80%] mx-auto p-4 sm:p-6 lg:p-8 ">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Bổ sung thông tin cá nhân
        </h1>
        <p className="text-xl text-center text-gray-500 mb-8">{gmailDefault}</p>

        <form onSubmit={onSubmitHandler} className="space-y-6" noValidate>
          {/* --- KHỐI THÔNG TIN CÁ NHÂN --- */}
          <div className="p-5 border rounded-xl bg-white shadow-lg">
            <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-3">
              Thông tin cơ bản
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-semibold mb-2 text-gray-700">
                  Họ và tên
                </label>
                <input
                  name="name"
                  value={data.name}
                  onChange={handleValueChange}
                  onBlur={handleBlur}
                  className={`w-full p-2 border rounded-md ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  type="text"
                  placeholder="Nguyễn Văn A"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>
              <div>
                <label className="block font-semibold mb-2 text-gray-700">
                  Ngày sinh
                </label>
                <input
                  name="birth"
                  value={data.birth}
                  onChange={handleValueChange}
                  onBlur={handleBlur}
                  className={`w-full p-2 border rounded-md ${
                    errors.birth ? "border-red-500" : "border-gray-300"
                  }`}
                  type="text"
                  placeholder="dd/mm/yyyy"
                />
                {errors.birth && (
                  <p className="text-red-500 text-sm mt-1">{errors.birth}</p>
                )}
              </div>
              <div>
                <label className="block font-semibold mb-2 text-gray-700">
                  Giới tính
                </label>
                <select
                  name="sex"
                  value={data.sex}
                  onChange={handleValueChange}
                  onBlur={handleBlur}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-2 text-gray-700">
                  Số CCCD
                </label>
                <input
                  name="idNumber"
                  value={data.idNumber}
                  onChange={handleValueChange}
                  onBlur={handleBlur}
                  className={`w-full p-2 border rounded-md ${
                    errors.idNumber ? "border-red-500" : "border-gray-300"
                  }`}
                  type="text"
                />
                {errors.idNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.idNumber}</p>
                )}
              </div>
              <div>
                <label className="block font-semibold mb-2 text-gray-700">
                  Dân tộc
                </label>
                <input
                  name="ethnicity"
                  value={data.ethnicity}
                  onChange={handleValueChange}
                  onBlur={handleBlur}
                  className={`w-full p-2 border rounded-md ${
                    errors.ethnicity ? "border-red-500" : "border-gray-300"
                  }`}
                  type="text"
                />
                {errors.ethnicity && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.ethnicity}
                  </p>
                )}
              </div>
              <div>
                <label className="block font-semibold mb-2 text-gray-700">
                  Tôn giáo
                </label>
                <input
                  name="religion"
                  value={data.religion}
                  onChange={handleValueChange}
                  onBlur={handleBlur}
                  className={`w-full p-2 border rounded-md ${
                    errors.religion ? "border-red-500" : "border-gray-300"
                  }`}
                  type="text"
                />
                {errors.religion && (
                  <p className="text-red-500 text-sm mt-1">{errors.religion}</p>
                )}
              </div>
            </div>
          </div>

          {/* --- KHỐI THÔNG TIN LIÊN HỆ & NGHỀ NGHIỆP --- */}
          <div className="p-5 border rounded-xl bg-white shadow-lg">
            <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-3">
              Thông tin liên hệ & Nghề nghiệp
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-semibold mb-2 text-gray-700">
                  Nghề nghiệp
                </label>
                <input
                  name="occupation"
                  value={data.occupation}
                  onChange={handleValueChange}
                  onBlur={handleBlur}
                  className={`w-full p-2 border rounded-md ${
                    errors.occupation ? "border-red-500" : "border-gray-300"
                  }`}
                  type="text"
                />
                {errors.occupation && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.occupation}
                  </p>
                )}
              </div>
              <div>
                <label className="block font-semibold mb-2 text-gray-700">
                  Số điện thoại
                </label>
                <input
                  name="phone"
                  value={data.phone}
                  onChange={handleValueChange}
                  onBlur={handleBlur}
                  className={`w-full p-2 border rounded-md ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                  type="text"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block font-semibold mb-2 text-gray-700">
                  Địa chỉ thường trú
                </label>
                <input
                  name="permanentAddress"
                  value={data.permanentAddress}
                  onChange={handleValueChange}
                  onBlur={handleBlur}
                  className={`w-full p-2 border rounded-md ${
                    errors.permanentAddress
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  type="text"
                />
                {errors.permanentAddress && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.permanentAddress}
                  </p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block font-semibold mb-2 text-gray-700">
                  Địa chỉ tạm trú
                </label>
                <input
                  name="temporaryAddress"
                  value={data.temporaryAddress}
                  onChange={handleValueChange}
                  onBlur={handleBlur}
                  className={`w-full p-2 border rounded-md ${
                    errors.temporaryAddress
                      ? "border-red-500"
                      : "border-gray-300"
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
          </div>

          {/* --- KHỐI HỌC VẤN --- */}
          <div className="p-5 border rounded-xl bg-white shadow-lg">
            <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-3">
              Trình độ & Học vấn
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-semibold mb-2 text-gray-700">
                  Trình độ học vấn
                </label>
                <input
                  name="educationLevel"
                  value={data.educationLevel}
                  onChange={handleValueChange}
                  onBlur={handleBlur}
                  className={`w-full p-2 border rounded-md ${
                    errors.educationLevel ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="12/12"
                />
                {errors.educationLevel && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.educationLevel}
                  </p>
                )}
              </div>
              <div>
                <label className="block font-semibold mb-2 text-gray-700">
                  Trình độ chuyên môn
                </label>
                <input
                  name="professionalLevel"
                  value={data.professionalLevel}
                  onChange={handleValueChange}
                  onBlur={handleBlur}
                  className={`w-full p-2 border rounded-md ${
                    errors.professionalLevel
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Kỹ sư phần mềm"
                />
                {errors.professionalLevel && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.professionalLevel}
                  </p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block font-semibold mb-2 text-gray-700">
                  Quá trình học tập
                </label>
                <textarea
                  name="education"
                  value={data.education}
                  onChange={handleValueChange}
                  onBlur={handleBlur}
                  className={`w-full p-2 border rounded-md min-h-[120px] ${
                    errors.education ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Ghi rõ các bậc học từ cấp 1 đến nay..."
                />
                {errors.education && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.education}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* --- KHỐI GIA ĐÌNH --- */}
          <div className="p-5 border rounded-xl bg-white shadow-lg">
            <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-3">
              Thông tin gia đình
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-semibold mb-2 text-gray-700">
                  Thông tin cha
                </label>
                <input
                  name="fatherInfo"
                  value={data.fatherInfo}
                  onChange={handleValueChange}
                  onBlur={handleBlur}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2 text-gray-700">
                  Thông tin mẹ
                </label>
                <input
                  name="motherInfo"
                  value={data.motherInfo}
                  onChange={handleValueChange}
                  onBlur={handleBlur}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2 text-gray-700">
                  Thông tin vợ/chồng
                </label>
                <input
                  name="wife"
                  value={data.wife}
                  onChange={handleValueChange}
                  onBlur={handleBlur}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2 text-gray-700">
                  Thông tin con
                </label>
                <input
                  name="children"
                  value={data.children}
                  onChange={handleValueChange}
                  onBlur={handleBlur}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block font-semibold mb-2 text-gray-700">
                  Thông tin anh chị em
                </label>
                <textarea
                  name="siblings"
                  value={data.siblings}
                  onChange={handleValueChange}
                  onBlur={handleBlur}
                  className="w-full p-2 border border-gray-300 rounded-md min-h-[120px]"
                />
              </div>
            </div>
          </div>

          <div className="w-full flex justify-center mt-6">
            <LoadingButton
              isLoading={isLoading}
              className="cursor-pointer bg-blue-600 text-white w-full hover:bg-blue-700"
              type="submit"
            >
              Gửi yêu cầu tạo thông tin
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;
