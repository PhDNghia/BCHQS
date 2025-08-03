// config/multerConfig.js
import multer from "multer";

const uploadAdd = multer({
  storage: multer.memoryStorage(), // Lưu file trong RAM (không ghi ra disk)
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Chỉ chấp nhận file ảnh (JPEG/PNG)"), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 10, // Tối đa 10 ảnh
  },
});

export default uploadAdd;
