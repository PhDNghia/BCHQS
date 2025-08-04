import React, { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import Swal from "sweetalert2";
import LoadingButton from "../components/LoadButton.jsx";
import { useNavigate } from "react-router-dom";
import slugify from "slugify";

const AddLegal = ({ token }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // State cho tất cả các trường
  const [formData, setFormData] = useState({
    mainLawCategory: "",
    field: "",
    documentCode: "",
    title: "",
    signer: "",
    status: "Còn hiệu lực",
    documentType: "Luật",
    issuingBody: "",
    issueDate: "",
    effectiveDate: "",
    summary: "",
    content: "",
  });

  const [pdfFile, setPdfFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const generatedSlug = slugify(formData.title, {
      lower: true,
      strict: true,
      locale: "vi",
    });

    const submissionData = new FormData();
    // Thêm tất cả dữ liệu text
    for (const key in formData) {
      submissionData.append(key, formData[key]);
    }
    submissionData.append("slug", generatedSlug);

    // Thêm các file nếu có với đúng tên trường
    if (pdfFile) {
      submissionData.append("pdfFile", pdfFile);
    }
    if (imageFile) {
      submissionData.append("imageFile", imageFile);
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/legal/create-legal`,
        submissionData,
        { headers: { token } }
      );

      if (response.data) {
        Swal.fire("Thành công", "Thêm văn bản thành công!", "success");
        navigate("/list-legal");
      }
    } catch (error) {
      Swal.fire(
        "Lỗi",
        error.response?.data?.message || "Có lỗi xảy ra.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const inputBaseStyle =
    "w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all";

  return (
    <div className="mx-auto p-8 max-w-4xl">
      <div className="flex w- justify-center items-center">
        <h1 className="flex-1 text-3xl font-bold mb-5 text-gray-800">
          Tạo văn bản pháp luật mới
        </h1>
        <button
          className="cursor-pointer py-2 bg-red-600 text-white w-[15%] hover:bg-red-700"
          onClick={() => navigate("/list-legal")}
        >
          Trở về
        </button>
      </div>
      <hr className="py-3 border-gray-300" />
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Hàng 1: Phân loại & Lĩnh vực */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 font-semibold text-gray-600">
              Phân loại chính (Luật gốc)
            </label>
            <input
              type="text"
              name="mainLawCategory"
              className={inputBaseStyle}
              value={formData.mainLawCategory}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold text-gray-600">
              Lĩnh vực
            </label>
            <input
              type="text"
              name="field"
              className={inputBaseStyle}
              value={formData.field}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        {/* Hàng 2: Số hiệu & Tiêu đề */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 font-semibold text-gray-600">
              Số hiệu văn bản
            </label>
            <input
              type="text"
              name="documentCode"
              className={inputBaseStyle}
              value={formData.documentCode}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold text-gray-600">
              Trích yếu / Tiêu đề
            </label>
            <input
              type="text"
              name="title"
              className={inputBaseStyle}
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        {/* Hàng 3: Người ký & Trạng thái */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 font-semibold text-gray-600">
              Người ký
            </label>
            <input
              type="text"
              name="signer"
              className={inputBaseStyle}
              value={formData.signer}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold text-gray-600">
              Trạng thái
            </label>
            <select
              name="status"
              className={inputBaseStyle}
              value={formData.status}
              onChange={handleInputChange}
            >
              <option>Còn hiệu lực</option>
              <option>Hết hiệu lực</option>
              <option>Bị thay thế</option>
              <option>Bị bãi bỏ</option>
              <option>Chưa có hiệu lực</option>
            </select>
          </div>
        </div>

        {/* Hàng 4: Loại văn bản & Cơ quan ban hành */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 font-semibold text-gray-600">
              Loại văn bản
            </label>
            <select
              name="documentType"
              className={inputBaseStyle}
              value={formData.documentType}
              onChange={handleInputChange}
            >
              <option>Luật</option>
              <option>Nghị định</option>
              <option>Thông tư</option>
              <option>Nghị quyết</option>
              <option>Quyết định</option>
              <option>Khác</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 font-semibold text-gray-600">
              Cơ quan ban hành
            </label>
            <input
              type="text"
              name="issuingBody"
              className={inputBaseStyle}
              value={formData.issuingBody}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        {/* Hàng 5: Ngày ban hành & Ngày hiệu lực */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 font-semibold text-gray-600">
              Ngày ban hành
            </label>
            <input
              type="date"
              name="issueDate"
              className={inputBaseStyle}
              value={formData.issueDate}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold text-gray-600">
              Ngày hiệu lực
            </label>
            <input
              type="date"
              name="effectiveDate"
              className={inputBaseStyle}
              value={formData.effectiveDate}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        {/* Input cho File Hình ảnh */}
        <div>
          <label className="block mb-2 font-semibold text-gray-600">
            Hình ảnh đại diện (Tùy chọn)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {/* Input cho File PDF */}
        <div>
          <label className="block mb-2 font-semibold text-gray-600">
            File PDF (Tùy chọn)
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setPdfFile(e.target.files[0])}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {/* Tóm tắt */}
        <div>
          <label className="block mb-2 font-semibold text-gray-600">
            Tóm tắt
          </label>
          <textarea
            name="summary"
            rows="4"
            className={inputBaseStyle}
            value={formData.summary}
            onChange={handleInputChange}
          ></textarea>
        </div>

        {/* Nội dung */}
        <div>
          <label className="block mb-2 font-semibold text-gray-600">
            Nội dung
          </label>
          <textarea
            name="content"
            rows="8"
            className={inputBaseStyle}
            value={formData.content}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>

        <div className="flex flex-col items-center justify-center mt-4">
          <LoadingButton
            isLoading={isLoading}
            className="cursor-pointer bg-blue-600 text-white w-[50%] hover:bg-blue-700"
            type="submit"
          >
            Thêm bài viết
          </LoadingButton>

          <button
            className="cursor-pointer bg-red-600 text-white w-[50%] hover:bg-red-700"
            onClick={() => navigate("/list-legal")}
          >
            Trở về
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddLegal;
