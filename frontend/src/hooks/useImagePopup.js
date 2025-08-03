import { useState } from "react";

// Custom hook này giúp quản lý trạng thái của popup (mở/đóng)
// Nó được export dưới dạng named export
export const useImagePopup = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  // Hàm để mở popup và lưu URL của ảnh
  const openPopup = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  // Hàm để đóng popup bằng cách đặt URL ảnh về null
  const closePopup = () => {
    setSelectedImage(null);
  };

  // Trả về trạng thái và các hàm để sử dụng trong các component khác
  return { selectedImage, openPopup, closePopup };
};
