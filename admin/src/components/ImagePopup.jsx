// ImagePopup.jsx
import React from "react";

const ImagePopup = ({ imageUrl, onClose }) => {
  if (!imageUrl) {
    return null;
  }

  return (
    // Lớp phủ toàn màn hình, không bị làm mờ
    <div
      className="fixed inset-0 bg-opacity-70 flex justify-center items-center z-50"
      onClick={onClose}
    >
      {/* Container cho ảnh */}
      <div className="relative z-10" onClick={(e) => e.stopPropagation()}>
        <img
          src={imageUrl}
          alt="Hình ảnh phóng to"
          // Bỏ class "blur-none" hoặc "filter-none" nếu có
          className="w-[100%] h-[100%] object-contain rounded-lg shadow-xl"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://placehold.co/800x600/333333/ffffff?text=Lỗi+ảnh";
          }}
        />
      </div>
    </div>
  );
};

export default ImagePopup;
