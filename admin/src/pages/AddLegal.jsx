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

  // State cho tất cả các trường trong form
  const [documentCode, setDocumentCode] = useState("");
  const [title, setTitle] = useState("");
  const [documentType, setDocumentType] = useState("Luật"); // Giá trị mặc định
  const [issuingBody, setIssuingBody] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // Định nghĩa style chung cho các input để tái sử dụng
  const inputBaseStyle =
    "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all";

  const handleSubmit = async (e) => {
    setIsLoading(true);

    const generatedSlug = slugify(title, {
      lower: true,
      strict: true,
      locale: "vi",
    });

    e.preventDefault();
    const newDocumentData = {
      documentCode,
      slug: generatedSlug,
      title,
      documentType,
      issuingBody,
      issueDate,
      effectiveDate,
      summary,
      content,
      imageUrl,
    };

    try {
      const res = await axios.post(
        backendUrl + "/api/legal/create-legal",
        newDocumentData,
        {
          headers: { token },
        }
      );

      if (res.data) {
        Swal.fire({
          title: "Thêm mới thành công",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
        navigate("/list-legal");
      } else {
        Swal.fire({
          title: "Lỗi",
          icon: "error",
          text: response.data.message,
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Lỗi",
        icon: "error",
        text: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Thay vì modal, đây là một div bình thường trên trang
    <div className="mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 pb-4 border-b text-gray-800">
        Tạo văn bản pháp luật mới
      </h1>

      <form onSubmit={handleSubmit} className="gap-x-8 gap-y-6">
        {/* Hàng 1: Số hiệu & Trích yếu */}
        <div className="flex flex-warp gap-4 mb-4">
          <div className="flex-1">
            <label
              htmlFor="documentCode"
              className="mb-2 font-semibold text-gray-600"
            >
              Số hiệu văn bản
            </label>
            <input
              id="documentCode"
              type="text"
              className={inputBaseStyle}
              value={documentCode}
              onChange={(e) => setDocumentCode(e.target.value)}
              required
            />
          </div>

          <div className="flex-1">
            <label htmlFor="title" className="mb-2 font-semibold text-gray-600">
              Trích yếu / Tiêu đề
            </label>
            <input
              id="title"
              type="text"
              className={inputBaseStyle}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Hàng 2: Loại & Cơ quan ban hành */}
        <div className="flex flex-warp gap-4 mb-4">
          <div className="flex-1">
            <label
              htmlFor="documentType"
              className="mb-2 font-semibold text-gray-600"
            >
              Loại văn bản
            </label>
            <select
              id="documentType"
              className={inputBaseStyle}
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
            >
              <option>Luật</option>
              <option>Nghị định</option>
              <option>Thông tư</option>
              <option>Nghị quyết</option>
              <option>Quyết định</option>
            </select>
          </div>

          <div className="flex-1">
            <label
              htmlFor="issuingBody"
              className="mb-2 font-semibold text-gray-600"
            >
              Cơ quan ban hành
            </label>
            <input
              id="issuingBody"
              type="text"
              className={inputBaseStyle}
              value={issuingBody}
              onChange={(e) => setIssuingBody(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Các trường full-width */}
        <div className="flex flex-warp gap-4 mb-4">
          <div className="flex-1">
            <label
              htmlFor="issueDate"
              className="mb-2 font-semibold text-gray-600"
            >
              Ngày ban hành
            </label>
            <input
              id="issueDate"
              type="date"
              className={inputBaseStyle}
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              required
            />
          </div>
          <div className="flex-1">
            <label
              htmlFor="effectiveDate"
              className="mb-2 font-semibold text-gray-600"
            >
              Ngày hiệu lực
            </label>
            <input
              id="effectiveDate"
              type="date"
              className={inputBaseStyle}
              value={effectiveDate}
              onChange={(e) => setEffectiveDate(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="col-span-2 flex flex-col">
          <label
            htmlFor="imageUrl"
            className="mb-2 font-semibold text-gray-600"
          >
            Link hình ảnh (URL)
          </label>
          <input
            id="imageUrl"
            type="text"
            className={inputBaseStyle}
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>

        <div className="col-span-2 flex flex-col">
          <label htmlFor="summary" className="mb-2 font-semibold text-gray-600">
            Tóm tắt
          </label>
          <textarea
            id="summary"
            rows="4"
            className={`${inputBaseStyle} min-h-[120px] `}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          ></textarea>
        </div>

        <div className="col-span-2 flex flex-col">
          <label htmlFor="content" className="mb-2 font-semibold text-gray-600">
            Nội dung
          </label>
          <textarea
            id="content"
            rows="8"
            className={`${inputBaseStyle} min-h-[120px] `}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>

        {/* Nút bấm */}
        <div className="w-full flex items-center justify-center mt-4">
          <LoadingButton
            isLoading={isLoading}
            className="cursor-pointer bg-blue-600 text-white w-[50%] hover:bg-blue-700"
            type="submit"
          >
            Thêm bài viết
          </LoadingButton>
        </div>
      </form>
    </div>
  );
};

export default AddLegal;
