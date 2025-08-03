// middleware/userAuth.js
import personModel from "../models/personModel.js";
import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  try {
    const { gmailUser } = req.body;

    const existingUser = await personModel.findOne({ gmailUser });

    if (!existingUser) {
      return res.json({ exists: false });
    }

    const token = jwt.sign(
      { id: existingUser._id, gmailUser: existingUser.gmailUser },
      process.env.JWT_SECRET || "secret_key"
    );

    req.user = existingUser;
    req.token = token;

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default userAuth; // Dùng default export
