import express from "express";
import {
  createDocument,
  updateDocument,
  deleteDocument,
  getAllDocuments,
  getDocumentById,
} from "../controllers/legalDocumentController.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

// Public routes (sử dụng GET)
router.get("/list-legal", getAllDocuments); // Lấy danh sách
router.post("/list-legalid", getDocumentById); // Lấy theo ID

// Private/Admin routes (sử dụng POST và có middleware)
router.post("/create-legal", adminAuth, createDocument);
router.post("/update-legal", adminAuth, updateDocument);
router.post("/delete-legal", adminAuth, deleteDocument);

export default router;
