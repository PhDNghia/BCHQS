import React from "react";

function DocumentList() {
  return (
    <div className="py-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">TẤT CẢ VĂN BẢN</h2>
      {/* <table className="min-w-full divide-y divide-gray-200">

        <tbody className="bg-white divide-y divide-gray-200"> */}
      {/* {documents.map((doc) => (
            <tr key={doc._id}>
              <td className="px-6 py-4">{doc.documentCode}</td>
              <td className="px-6 py-4">
                {new Date(doc.issueDate).toLocaleDateString("vi-VN")}
              </td>
              <td className="px-6 py-4">{doc.title}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {documents.length === 0 && !loading && ( */}
      <p className="text-center p-10 text-gray-500">
        Không tìm thấy văn bản nào phù hợp.
      </p>
      {/* )} */}
    </div>
  );
}

export default DocumentList;
