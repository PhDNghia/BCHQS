import express from "express";
import {
  createPending,
  deleteMorePending,
  deletePending,
  getAllPendings,
  getPendingByGmail,
  reviewPending,
} from "../controllers/pendingController.js";
import adminAuth from "../middleware/adminAuth.js";
import upload from "../middleware/multer.js";

const pendingRouter = express.Router();

pendingRouter.get("/get-pending", adminAuth, getAllPendings);

pendingRouter.post("/get-pending-gmail", getPendingByGmail);

pendingRouter.post("/create-pending", upload.array("newImages"), createPending);

pendingRouter.post("/update-pending", adminAuth, reviewPending);

pendingRouter.post("/remove-pending", adminAuth, deletePending);

pendingRouter.post("/remove-more-pending", adminAuth, deleteMorePending);

export default pendingRouter;
