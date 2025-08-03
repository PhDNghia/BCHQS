import express from "express";
import {
  adminLogin,
  checkUser,
  updateUser,
  addUser,
} from "../controllers/userController.js";
import userAuth from "../middleware/userAuth.js";
import upload from "../middleware/multer.js";
import uploadAdd from "../middleware/multerAdd.js";
import { maintenanceCheck } from "../middleware/maintenance.js";

const userRouter = express.Router();

userRouter.post("/admin", adminLogin);
userRouter.post("/check-gmail", checkUser);
userRouter.post(
  "/update-user",
  maintenanceCheck,
  upload.array("images", 10),
  userAuth,
  updateUser
);
userRouter.post(
  "/add-user",
  maintenanceCheck,
  uploadAdd.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
    { name: "image5", maxCount: 1 },
    { name: "image6", maxCount: 1 },
    { name: "image7", maxCount: 1 },
    { name: "image8", maxCount: 1 },
    { name: "image9", maxCount: 1 },
    { name: "image10", maxCount: 1 },
  ]),
  addUser
);

export default userRouter;
