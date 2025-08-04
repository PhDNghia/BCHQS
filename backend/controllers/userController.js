import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import personModel from "../models/personModel.js";

// Router for admin login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Sai tên đăng nhập hoặc mật khẩu!" });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Router check login
export const checkUser = async (req, res) => {
  try {
    // THÊM KIỂM TRA: Đảm bảo JWT_SECRET tồn tại
    if (!process.env.JWT_SECRET) {
      console.error(
        "LỖI NGHIÊM TRỌNG: JWT_SECRET chưa được định nghĩa trong file .env của backend!"
      );
      return res
        .status(500)
        .json({ success: false, message: "Lỗi cấu hình máy chủ." });
    }

    const { gmailUser } = req.body;
    const person = await personModel.findOne({ "gmailUser.value": gmailUser });

    if (person) {
      const token = jwt.sign(
        { id: person._id, gmailUser: person.gmailUser },
        process.env.JWT_SECRET
      );
      return res.status(200).json({ success: true, token, person });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "User chưa tồn tại" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Đã có lỗi xảy ra ở máy chủ" });
  }
};

//Router for user add
export const addUser = async (req, res) => {
  try {
    // THÊM KIỂM TRA: Đảm bảo JWT_SECRET tồn tại
    if (!process.env.JWT_SECRET) {
      console.error(
        "LỖI NGHIÊM TRỌNG: JWT_SECRET chưa được định nghĩa trong file .env của backend!"
      );
      return res
        .status(500)
        .json({ success: false, message: "Lỗi cấu hình máy chủ." });
    }

    const {
      name,
      birth,
      sex,
      idNumber,
      occupation,
      permanentAddress,
      temporaryAddress,
      ethnicity,
      religion,
      educationLevel,
      professionalLevel,
      fatherInfo,
      motherInfo,
      wife,
      children,
      siblings,
      education,
      phone,
      category,
      gmailUser,
    } = req.body;

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];
    const image5 = req.files.image5 && req.files.image5[0];
    const image6 = req.files.image6 && req.files.image6[0];
    const image7 = req.files.image7 && req.files.image7[0];
    const image8 = req.files.image8 && req.files.image8[0];
    const image9 = req.files.image9 && req.files.image9[0];
    const image10 = req.files.image10 && req.files.image10[0];

    const images = [
      image1,
      image2,
      image3,
      image4,
      image5,
      image6,
      image7,
      image8,
      image9,
      image10,
    ].filter((item) => item !== undefined);

    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          folder: "person_uploads",
        });
        return result.secure_url;
      })
    );

    const personData = {
      name,
      birth,
      sex,
      idNumber,
      occupation,
      permanentAddress,
      temporaryAddress,
      ethnicity,
      religion,
      educationLevel,
      professionalLevel,
      fatherInfo,
      motherInfo,
      wife,
      children,
      siblings,
      education,
      phone,
      category,
      image: imagesUrl,
      gmailUser,
      date: Date.now(),
    };

    const person = new personModel(personData);
    await person.save();

    // Tạo token để tự động đăng nhập, bao gồm cả id và gmailUser
    const token = jwt.sign(
      { id: person._id, gmailUser: person.gmailUser },
      process.env.JWT_SECRET
    );
    res.status(201).json({ success: true, token, person }); // 201 Created
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Router for user update
export const updateUser = async (req, res) => {
  try {
    const {
      id,
      name,
      birth,
      sex,
      idNumber,
      occupation,
      permanentAddress,
      temporaryAddress,
      ethnicity,
      religion,
      educationLevel,
      professionalLevel,
      fatherInfo,
      motherInfo,
      wife,
      children,
      siblings,
      education,
      phone,
      category,
      gmailUser,
      deletedImages = "[]",
    } = req.body;

    console.log(">>> BODY:", req.body);
    console.log(">>> FILES:", req.files);

    const gmailExists = await personModel.findOne({
      gmailUser,
      _id: { $ne: id },
    });
    if (gmailExists) {
      return res
        .status(400)
        .json({ success: false, message: "Gmail đã tồn tại" });
    }

    const deletedUrls = JSON.parse(deletedImages);

    // ====== 1. XÓA ẢNH TRÊN CLOUDINARY ======
    const getPublicIdFromUrl = (url) => {
      const parts = url.split("/");
      const fileName = parts.pop().split(".")[0]; // abcxyz123
      const folder = parts.pop(); // person_uploads
      return `${folder}/${fileName}`; // person_uploads/abcxyz123
    };

    await Promise.all(
      deletedUrls.map((url) => {
        const publicId = getPublicIdFromUrl(url);
        return cloudinary.uploader.destroy(publicId);
      })
    );

    // ====== 2. UPLOAD ẢNH MỚI ======
    const newImageUrls = [];
    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
        { folder: "person_uploads" }
      );
      newImageUrls.push(result.secure_url);
    }

    // ====== 3. CẬP NHẬT DỮ LIỆU TRONG MONGODB ======
    const person = await personModel.findById(id);
    let updatedImages = person.image.filter(
      (img) => !deletedUrls.includes(img)
    );
    updatedImages = [...updatedImages, ...newImageUrls];

    await personModel.findByIdAndUpdate(id, {
      name,
      birth,
      sex,
      idNumber,
      occupation,
      permanentAddress,
      temporaryAddress,
      ethnicity,
      religion,
      educationLevel,
      professionalLevel,
      fatherInfo,
      motherInfo,
      wife,
      children,
      siblings,
      education,
      phone,
      category,
      gmailUser,
      image: updatedImages,
      date: Date.now(),
    });

    res.json({
      success: true,
      message: "Cập nhật thành công",
      deletedCount: deletedUrls.length,
      newImages: newImageUrls,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
