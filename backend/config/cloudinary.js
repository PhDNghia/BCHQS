// import { v2 as cloudinary } from "cloudinary";

// const connectCloudinary = async () => {
//   cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_SECRET_KEY,
//   });
// };

// export default connectCloudinary;

// File: backend/config/cloudinary.js

import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

const cloud_name = process.env.CLOUDINARY_NAME;
const api_key = process.env.CLOUDINARY_API_KEY;
const api_secret = process.env.CLOUDINARY_SECRET_KEY;

// Kiểm tra xem các biến môi trường có tồn tại không
if (!cloud_name || !api_key || !api_secret) {
  console.error(
    "🔥🔥🔥 LỖI CẤU HÌNH: Vui lòng cung cấp đầy đủ thông tin CLOUDINARY trong file .env của backend."
  );
  process.exit(1);
}

// Thực hiện cấu hình ngay khi file này được import
cloudinary.config({
  cloud_name: cloud_name,
  api_key: api_key,
  api_secret: api_secret,
});

export default cloudinary; // Export đối tượng cloudinary đã được cấu hình
