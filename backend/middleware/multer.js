import multer from "multer";

const storage = multer.memoryStorage(); // Cho phép upload vào buffer (dùng cho Cloudinary)
const upload = multer({ storage });

export default upload
