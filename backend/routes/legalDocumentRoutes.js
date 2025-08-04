import express from "express";
import multer from "multer";
import {
  createDocument,
  updateDocument,
  deleteDocument,
  getAllDocuments,
  getDocumentById,
} from "../controllers/legalDocumentController.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Public routes (sử dụng GET)
router.get("/list-legal", getAllDocuments); // Lấy danh sách
router.get("/list-legal/:id", getDocumentById); // Lấy theo ID

// Private/Admin routes (sử dụng POST và có middleware)
router.post(
  "/create-legal",
  adminAuth,
  upload.fields([
    { name: "pdfFile", maxCount: 1 },
    { name: "imageFile", maxCount: 1 },
  ]),
  createDocument
);
router.put(
  "/update-legal/:id",
  adminAuth,
  upload.fields([
    { name: "pdfFile", maxCount: 1 },
    { name: "imageFile", maxCount: 1 },
  ]),
  updateDocument
);
router.delete("/delete-legal/:id", adminAuth, deleteDocument);

export default router;
