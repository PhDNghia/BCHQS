import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import slugify from "slugify";
import LoadingButton from "../components/LoadButton.jsx";
import { backendUrl } from "../App";
import Swal from "sweetalert2";

// Hàm tiện ích để định dạng ngày tháng cho input
const formatDateForInput = (isoDate) => {
  if (!isoDate) return "";
  return isoDate.split("T")[0];
};

const EditLegal = ({ token }) => {
  const [isLoading, setIsLoading] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  const [documentCode, setDocumentCode] = useState("");
  const [title, setTitle] = useState("");
  const [documentType, setDocumentType] = useState("Luật");
  const [issuingBody, setIssuingBody] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const res = await axios.post(`${backendUrl}/api/legal/list-legalid`, {
          id,
        });

        if (res.data) {
          const dataNew = res.data;
          setDocumentCode(dataNew.documentCode || "");
          setTitle(dataNew.title || "");
          setDocumentType(dataNew.documentType || "Luật");
          setIssuingBody(dataNew.issuingBody || "");
          setIssueDate(formatDateForInput(dataNew.issueDate));
          setEffectiveDate(formatDateForInput(dataNew.effectiveDate));
          setSummary(dataNew.summary || "");
          setContent(dataNew.content || "");
          setImageUrl(dataNew.imageUrl || "");
        }
      } catch (error) {}
    };

    fetchDocument();
  }, [id, token, navigate]);

  const handleSubmit = async (e) => {
    setIsLoading(true);

    e.preventDefault();

    const slug = slugify(title, { lower: true, strict: true, locale: "vi" });

    const updatedData = {
      id,
      documentCode,
      title,
      slug,
      documentType,
      issuingBody,
      issueDate,
      effectiveDate,
      summary,
      content,
      imageUrl,
    };

    try {
      const response = await axios.post(
        `${backendUrl}/api/legal/update-legal`,
        updatedData,
        {
          headers: { token },
        }
      );

      if (response.data) {
        Swal.fire({
          title: "Chỉnh sửa thành công",
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

  const inputBaseStyle =
    "w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all";

  return (
    <div className="mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 pb-4 border-b text-gray-800">
        Chỉnh sửa văn bản pháp luật
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-12 gap-x-6 gap-y-6"
      >
        <div className="col-span-12 md:col-span-3 flex flex-col">
          <label
            htmlFor="documentCode"
            className="mb-2 font-semibold text-gray-600"
          >
            Số hiệu VB
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

        <div className="col-span-12 md:col-span-3 flex flex-col">
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

        <div className="col-span-12 md:col-span-3 flex flex-col">
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

        <div className="col-span-12 md:col-span-3 flex flex-col">
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

        <div className="col-span-12 md:col-span-4 flex flex-col">
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

        <div className="col-span-12 md:col-span-4 flex flex-col">
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

        <div className="col-span-12 md:col-span-4 flex flex-col">
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

        <div className="col-span-12 flex flex-col">
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

        <div className="col-span-12 flex flex-col">
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

        <div className="col-span-12 flex flex-col items-center justify-center mt-4">
          <LoadingButton
            isLoading={isLoading}
            className="cursor-pointer bg-blue-600 text-white w-[50%] hover:bg-blue-700"
            type="submit"
          >
            Sửa bài viết
          </LoadingButton>
        </div>
      </form>
    </div>
  );
};

export default EditLegal;
