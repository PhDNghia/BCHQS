import express from "express";
import { updateMaintenanceMode } from "../controllers/settingsController.js";
import adminAuth from "../middleware/adminAuth.js";

const settingsRouter = express.Router();

settingsRouter.post("/maintenance", adminAuth, updateMaintenanceMode);

export default settingsRouter;
