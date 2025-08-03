import express from "express";
import {
  listPerson,
  addPerson,
  singlePerson,
  removePerson,
  updatePerson,
  getFilteredPersons,
} from "../controllers/personController.js";
import upload from "../middleware/multer.js";
import uploadAdd from "../middleware/multerAdd.js";
import adminAuth from "../middleware/adminAuth.js";

const personRouter = express.Router();



// admin
personRouter.get("/list", listPerson);
personRouter.post(
  "/add",
  adminAuth,
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
  addPerson
);
personRouter.post("/remove", adminAuth, removePerson);
personRouter.post("/single", adminAuth, singlePerson);
personRouter.post(
  "/update",
  adminAuth,
  upload.array("images", 10),
  updatePerson
);
personRouter.get("/list-search", adminAuth, getFilteredPersons);

export default personRouter;
