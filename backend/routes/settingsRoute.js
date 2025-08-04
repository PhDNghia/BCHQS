import express from "express";
import {
  getMaintenanceStatus,
  updateMaintenanceMode,
} from "../controllers/settingsController.js";
import adminAuth from "../middleware/adminAuth.js";

const settingsRouter = express.Router();

settingsRouter.get("/maintenance-status", getMaintenanceStatus);

settingsRouter.post("/maintenance", adminAuth, updateMaintenanceMode);

export default settingsRouter;
