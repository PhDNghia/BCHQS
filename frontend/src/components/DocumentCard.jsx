import React from "react";
import { Link } from "react-router-dom";

const DocumentCard = ({ doc }) => {
  return (
    <Link
      to={`/van-ban/${doc.slug}`}
      className="block bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border"
    >
      <p className="text-sm font-semibold text-blue-600">{doc.documentCode}</p>
      <h3 className="text-lg font-bold text-gray-800 mt-2 leading-tight">
        {doc.title}
      </h3>
      <div className="text-xs text-gray-500 mt-4">
        <p>
          <strong>Cơ quan ban hành:</strong> {doc.issuingBody}
        </p>
        <p>
          <strong>Ngày hiệu lực:</strong>{" "}
          {new Date(doc.effectiveDate).toLocaleDateString("vi-VN")}
        </p>
      </div>
    </Link>
  );
};

export default DocumentCard;
