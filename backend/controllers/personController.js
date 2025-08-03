import personModel from "../models/personModel.js";
import { Clerk } from "@clerk/clerk-sdk-node";
import { v2 as cloudinary } from "cloudinary";
import {
  adminUpdatePersonSchema,
  createPersonSchema,
  updateUserProfileSchema,
} from "../validations/person.validation.js";

const clerkClient = new Clerk({ apiKey: process.env.CLERK_SECRET_KEY });

// Lấy danh sách tất cả person
export const listPerson = async (req, res) => {
  try {
    const persons = await personModel.find({});
    res.json({ success: true, persons });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Lấy thông tin person bằng ID
export const singlePerson = async (req, res) => {
  try {
    const { personId } = req.body;
    const person = await personModel.findById(personId);
    res.json({ success: true, person });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Thêm mới person
export const addPerson = async (req, res) => {
  try {
    // 1. Parse dữ liệu
    if (!req.body.person) {
      return res
        .status(400)
        .json({ success: false, message: "Thiếu dữ liệu person" });
    }
    const personDataObject = JSON.parse(req.body.person);

    // 2. ÁP DỤNG JOI VALIDATION VỚI TÙY CHỌN MỚI
    const { error, value: validatedData } = createPersonSchema.validate(
      personDataObject,
      {
        abortEarly: false, // Hiển thị tất cả lỗi
        stripUnknown: true, // <-- THAY ĐỔI QUAN TRỌNG: Lờ đi và loại bỏ các trường không xác định (như 'date')
      }
    );

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Dữ liệu không hợp lệ",
        details: error.details.map((d) => d.message),
      });
    }

    // 3. KIỂM TRA TÍNH DUY NHẤT (Sử dụng validatedData)
    const { value: email } = validatedData.gmailUser;
    const { value: idNumber } = validatedData.idNumber;

    const existingPerson = await personModel.findOne({
      $or: [{ "gmailUser.value": email }, { "idNumber.value": idNumber }],
    });

    if (existingPerson) {
      let message = "Thông tin đã tồn tại.";
      if (existingPerson.gmailUser.value === email)
        message = "Email đã tồn tại.";
      if (existingPerson.idNumber.value === idNumber)
        message = "Số CCCD đã tồn tại.";
      return res.status(409).json({ success: false, message });
    }

    // 4. XỬ LÝ UPLOAD ẢNH (Logic gộp vào, không thay đổi)
    const imageUrls = [];
    if (req.files && Object.keys(req.files).length > 0) {
      // Hàm upload được định nghĩa ngay bên trong để không tách hàm
      const uploadToCloudinary = (fileBuffer) => {
        return new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              { folder: "person_uploads", resource_type: "auto" },
              (error, result) => {
                if (error) reject(error);
                else resolve(result.secure_url);
              }
            )
            .end(fileBuffer);
        });
      };

      try {
        // Giữ nguyên logic lặp qua các file ảnh bạn đang dùng
        const uploadPromises = [];
        for (const key in req.files) {
          if (req.files[key] && req.files[key][0]) {
            const file = req.files[key][0];
            uploadPromises.push(uploadToCloudinary(file.buffer));
          }
        }
        const resolvedUrls = await Promise.all(uploadPromises);
        imageUrls.push(...resolvedUrls);
      } catch (uploadError) {
        console.error("Lỗi upload ảnh:", uploadError);
        return res.status(500).json({
          success: false,
          message: "Lỗi khi upload ảnh lên Cloudinary",
        });
      }
    }

    // 5. TẠO DOCUMENT MỚI (Sử dụng validatedData)
    const finalPersonData = {};
    for (const key in validatedData) {
      finalPersonData[key] = {
        value: validatedData[key].value,
        editable: true, // Theo model mới, mặc định là true
      };
    }
    finalPersonData.date = { value: new Date(), editable: true };
    finalPersonData.image = {
      value: imageUrls.length > 0 ? imageUrls : [],
      editable: true,
    };

    // 6. Lưu vào database
    const newPerson = await personModel.create(finalPersonData);

    // 7. Trả về response
    return res.status(201).json({
      success: true,
      message: "Thêm người dùng thành công",
      person: newPerson,
    });
  } catch (err) {
    console.error("Lỗi khi thêm người dùng:", err);
    if (err instanceof SyntaxError) {
      return res.status(400).json({
        success: false,
        message: "Dữ liệu person không phải là JSON hợp lệ.",
      });
    }
    return res
      .status(500)
      .json({ success: false, message: "Lỗi server khi thêm người dùng" });
  }
};

export const updatePerson = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Thiếu ID người dùng trong body" });
    }

    // --- HÀM HỖ TRỢ UPLOAD ẢNH (Định nghĩa bên trong) ---
    const uploadImagesToCloudinary = async (files) => {
      if (!files || files.length === 0) return [];
      const uploadPromises = files.map((file) => {
        return new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              { folder: "person_uploads", resource_type: "auto" },
              (error, result) => {
                if (error) reject(error);
                else resolve(result.secure_url);
              }
            )
            .end(file.buffer);
        });
      });
      return Promise.all(uploadPromises);
    };

    // --- HÀM HỖ TRỢ XÓA ẢNH (LOGIC MỚI, ĐÁNG TIN CẬY HƠN) ---
    const deleteImagesFromCloudinary = async (urls) => {
      if (!urls || urls.length === 0) return;

      const getPublicId = (url) => {
        try {
          // Tìm "person_uploads" trong URL và lấy phần còn lại
          const searchTerm = "person_uploads/";
          const startIndex = url.indexOf(searchTerm);
          if (startIndex === -1) return null;

          const publicIdWithExtension = url.substring(startIndex);
          return publicIdWithExtension.substring(
            0,
            publicIdWithExtension.lastIndexOf(".")
          );
        } catch (e) {
          console.error("Could not derive public_id from url", url);
          return null;
        }
      };

      const deletePromises = urls.map((url) => {
        const publicId = getPublicId(url);
        if (publicId) return cloudinary.uploader.destroy(publicId);
        return Promise.resolve();
      });
      await Promise.all(deletePromises);
    };

    // 1. Parse dữ liệu
    if (!req.body.person) {
      return res
        .status(400)
        .json({ success: false, message: "Thiếu dữ liệu person" });
    }
    const updateDataObject = JSON.parse(req.body.person);

    // 2. Validate dữ liệu bằng Joi
    const { error, value: validatedData } = adminUpdatePersonSchema.validate(
      updateDataObject,
      { stripUnknown: true }
    );
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Dữ liệu không hợp lệ",
        details: error.details.map((d) => d.message),
      });
    }

    // 3. Tìm người dùng trong DB
    const person = await personModel.findById(id);
    if (!person) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy người dùng" });
    }

    // 4. Kiểm tra tính duy nhất
    const orConditions = [];
    if (validatedData.gmailUser)
      orConditions.push({ "gmailUser.value": validatedData.gmailUser.value });
    if (validatedData.idNumber)
      orConditions.push({ "idNumber.value": validatedData.idNumber.value });

    if (orConditions.length > 0) {
      const existingPerson = await personModel.findOne({
        _id: { $ne: id },
        $or: orConditions,
      });
      if (existingPerson) {
        return res.status(409).json({
          success: false,
          message: "Thông tin (Email/CCCD) đã được sử dụng bởi người khác.",
        });
      }
    }

    // 5. Xử lý ảnh
    const deletedUrls = JSON.parse(req.body.deletedImages || "[]");
    await deleteImagesFromCloudinary(deletedUrls);
    const newImageUrls = await uploadImagesToCloudinary(req.files);

    let updatedImageArray = (person.image?.value ?? []).filter(
      (img) => !deletedUrls.includes(img)
    );
    updatedImageArray = [...updatedImageArray, ...newImageUrls];

    // 6. Xây dựng object cập nhật bằng dot notation
    const finalUpdates = {};

    for (const key in validatedData) {
      if (validatedData.hasOwnProperty(key)) {
        const clientFieldData = validatedData[key];
        finalUpdates[`${key}.value`] = clientFieldData.value;
        if (typeof clientFieldData.editable === "boolean") {
          finalUpdates[`${key}.editable`] = clientFieldData.editable;
        }
      }
    }

    finalUpdates["image.value"] = updatedImageArray;
    if (
      updateDataObject.image &&
      typeof updateDataObject.image.editable === "boolean"
    ) {
      finalUpdates["image.editable"] = updateDataObject.image.editable;
    }
    finalUpdates["date.value"] = new Date();

    // 7. Cập nhật vào DB
    const updatedPerson = await personModel.findByIdAndUpdate(
      id,
      { $set: finalUpdates },
      { new: true }
    );

    res.json({
      success: true,
      message: "Cập nhật thành công",
      data: updatedPerson,
    });
  } catch (err) {
    console.error("Lỗi khi cập nhật:", err);
    if (err instanceof SyntaxError) {
      return res.status(400).json({
        success: false,
        message: "Dữ liệu person hoặc deletedImages không phải là JSON hợp lệ.",
      });
    }
    res
      .status(500)
      .json({ success: false, message: "Lỗi server khi cập nhật" });
  }
};

// Xóa person
export const removePerson = async (req, res) => {
  try {
    const person = await personModel.findById(req.body.id);
    if (!person)
      return res
        .status(404)
        .json({ success: false, message: "Person not found" });

    // Lấy mảng ảnh đúng nếu là object
    const images = Array.isArray(person.image)
      ? person.image
      : person.image?.value || [];

    if (person.gmailUser.value === "thenghia1906@gmail.com") {
      return res.json({
        success: false,
        message: "Không thể xóa quản trị viên!!",
      });
    }

    await Promise.all(
      images.map(async (url) => {
        if (!url) return;
        const parts = url.split("/");
        const file = parts.pop().split(".")[0];
        const folder = parts.pop();
        const publicId = `${folder}/${file}`;
        await cloudinary.uploader.destroy(publicId);
      })
    );

    const userList = await clerkClient.users.getUserList({
      emailAddress: [person.gmailUser],
    });

    // Kiểm tra userList.users nếu có cấu trúc vậy
    const users = userList.users || userList; // tuỳ API trả về
    if (users.length > 0) {
      const clerkUserId = users[0].id;
      try {
        await clerkClient.users.deleteUser(clerkUserId);
        console.log(`User ${clerkUserId} deleted on Clerk`);
      } catch (deleteErr) {
        console.error("Error deleting Clerk user:", deleteErr);
      }
    } else {
      console.log(
        "Không tìm thấy user trên Clerk với email:",
        person.gmailUser
      );
    }

    await personModel.findByIdAndDelete(req.body.id);

    console.log("Person deleted from your database");

    res.json({ success: true, message: "Person & images removed" });
  } catch (err) {
    console.error("Remove person error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Tìm kiếm theo phân loại
export const getFilteredPersons = async (req, res) => {
  const { name, status, query } = req.query;

  // Tạo object filter cho MongoDB
  let filter = {};

  if (name) {
    filter["name.value"] = { $regex: name, $options: "i" };
  }

  if (status) {
    filter["category.value"] = status;
  }

  if (query) {
    const regexQuery = query.trim(); // ⚠️ loại bỏ dấu cách
    filter.$or = [
      { "name.value": { $regex: regexQuery, $options: "i" } },
      { "birth.value": { $regex: regexQuery, $options: "i" } },
      { "sex.value": { $regex: regexQuery, $options: "i" } },
      { "idNumber.value": { $regex: regexQuery, $options: "i" } },
      { "occupation.value": { $regex: regexQuery, $options: "i" } },
      { "permanentAddress.value": { $regex: regexQuery, $options: "i" } },
      { "temporaryAddress.value": { $regex: regexQuery, $options: "i" } },
      { "ethnicity.value": { $regex: regexQuery, $options: "i" } },
      { "religion.value": { $regex: regexQuery, $options: "i" } },
      { "educationLevel.value": { $regex: regexQuery, $options: "i" } },
      { "professionalLevel.value": { $regex: regexQuery, $options: "i" } },
      { "wife.value": { $regex: regexQuery, $options: "i" } },
      { "children.value": { $regex: regexQuery, $options: "i" } },
      { "fatherInfo.value": { $regex: regexQuery, $options: "i" } },
      { "motherInfo.value": { $regex: regexQuery, $options: "i" } },
      { "siblings.value": { $regex: regexQuery, $options: "i" } },
      { "education.value": { $regex: regexQuery, $options: "i" } },
      { "phone.value": { $regex: regexQuery, $options: "i" } },
      { "category.value": { $regex: regexQuery, $options: "i" } },
      { "categoryReason.value": { $regex: regexQuery, $options: "i" } },
      { "gmailUser.value": { $regex: regexQuery, $options: "i" } },
    ];
  }

  try {
    console.log("Filter query:", JSON.stringify(filter, null, 2));
    const persons = await personModel.find(filter);
    if (persons && persons.length > 0) {
      res.json(persons);
    } else {
      res.json({ message: "None" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
