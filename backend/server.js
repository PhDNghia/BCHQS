import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import personRouter from "./routes/personRoute.js";
import userRouter from "./routes/userRoute.js";
import pendingRouter from "./routes/pendingRoute.js";
import settingsRouter from "./routes/settingsRoute.js";
import legalDocumentRouter from "./routes/legalDocumentRoutes.js";

import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";
// App Config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// Middlewares
app.use(express.json());
app.use(cors());

app.use("/api/settings", settingsRouter);
app.use("/api/person", personRouter);
app.use("/api/legal", legalDocumentRouter);

app.use(ClerkExpressWithAuth());

app.use("/api/user", userRouter);
app.use("/api/pending", pendingRouter);

// Api Endpoints
app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () => console.log("Server started on PORT: " + port));
