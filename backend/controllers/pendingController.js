import pendingModel from "../models/pendingModel.js";
import personModel from "../models/personModel.js";
import { v2 as cloudinary } from "cloudinary";
import { sendEmail } from "../config/emailService.js";
import {
  adminUpdatePersonSchema,
  createPersonSchema,
  updateUserProfileSchema,
} from "../validations/person.validation.js";

// --- HÀM UPLOAD ẢNH LÊN CLOUDINARY ---
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          // SỬA LẠI: Upload vào thư mục tạm với tên đúng
          folder: "pending_uploads",
          resource_type: "auto",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      )
      .end(fileBuffer);
  });
};

// --- CÁC HÀM HELPER XỬ LÝ ẢNH TRÊN CLOUDINARY ---
const getPublicIdFromUrl = (url) => {
  try {
    // Đảm bảo URL là một chuỗi hợp lệ
    if (typeof url !== "string" || !url.includes("/upload/")) {
      console.warn(
        `[Cloudinary] URL không hợp lệ hoặc thiếu '/upload/': ${url}`
      );
      return null;
    }

    const pathAfterUpload = url.split("/upload/")[1];
    const pathParts = pathAfterUpload.split("/");

    // Loại bỏ phiên bản (ví dụ: v12345...) nếu có
    if (pathParts[0].match(/^v\d+$/)) {
      pathParts.shift();
    }

    const publicIdWithExt = pathParts.join("/");
    // Loại bỏ phần mở rộng file (.jpg, .png, ...)
    return publicIdWithExt.substring(0, publicIdWithExt.lastIndexOf("."));
  } catch (e) {
    console.error(
      `[Cloudinary] Lỗi khi trích xuất public_id từ URL: ${url}`,
      e
    );
    return null;
  }
};

// Hàm xóa ảnh
const deleteImagesFromCloudinary = async (urls) => {
  if (!urls || urls.length === 0) return;

  // Lọc ra các public_id hợp lệ
  const publicIds = urls.map(getPublicIdFromUrl).filter((id) => id);

  if (publicIds.length > 0) {
    console.log("[Cloudinary] Các public_id sẽ bị xóa:", publicIds);
    // Sử dụng try-catch để bắt lỗi nếu API call thất bại
    try {
      await cloudinary.api.delete_resources(publicIds);
    } catch (error) {
      console.error("[Cloudinary] Lỗi khi gọi API delete_resources:", error);
    }
  }
};

// Hàm di chuyển ảnh
const moveImagesInCloudinary = async (urls) => {
  if (!urls || urls.length === 0) return [];

  // Sử dụng Promise.all để xử lý tất cả các URL một cách song song, hiệu quả hơn
  const processedUrls = await Promise.all(
    urls.map(async (url) => {
      const fromPublicId = getPublicIdFromUrl(url);

      // Chỉ xử lý nếu có publicId và nó bắt đầu bằng "pending_uploads/"
      if (fromPublicId && fromPublicId.startsWith("pending_uploads/")) {
        try {
          const toPublicId = fromPublicId.replace(
            "pending_uploads/",
            "person_uploads/"
          );

          // Thực hiện lệnh di chuyển (rename)
          const result = await cloudinary.uploader.rename(
            fromPublicId,
            toPublicId
          );

          // Lệnh rename đã thành công, trả về URL MỚI để đưa vào mảng kết quả
          return result.secure_url;
        } catch (error) {
          // Nếu có lỗi trong quá trình rename, log lỗi và trả về URL CŨ
          console.error(
            `[Cloudinary] Lỗi khi di chuyển ${fromPublicId}:`,
            error
          );
          return url;
        }
      }

      // Nếu không phải ảnh cần di chuyển, trả về URL CŨ như bình thường
      return url;
    })
  );

  // Trả về mảng các URL đã được xử lý hoàn chỉnh
  return processedUrls;
};
// --------------------------------------------------------------------------------------------------------

export const getAllPendings = async (req, res) => {
  try {
    const pending = await pendingModel.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, pending });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Controller lấy pending theo gmailUser
export const getPendingByGmail = async (req, res) => {
  const { gmailUser } = req.body;

  try {
    const pending = await pendingModel.find({ "gmailUser.value": gmailUser });
    if (!pending || pending.length === 0) {
      return res.json({
        success: false,
        message: "Không tìm thấy pending nào",
      });
    }
    res.json({ success: true, pending });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi server", error: error.message });
  }
};

//delete pending
export const deletePending = async (req, res) => {
  const { pendingId } = req.body; // lấy id từ body hoặc params

  if (!pendingId) {
    return res
      .status(400)
      .json({ success: false, message: "Thiếu khóa của yêu cầu" });
  }

  try {
    const deleted = await pendingModel.findByIdAndDelete(pendingId);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Yêu cầu không tồn tại" });
    }
    return res.json({ success: true, message: "Xóa yêu cầu thành công" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

//delete mores pending
export const deleteMorePending = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Thiếu khóa hoặc mảng IDs không hợp lệ",
      });
    }

    const result = await pendingModel.deleteMany({ _id: { $in: ids } });

    if (result.deletedCount > 0) {
      res.status(200).json({
        success: true,
        message: `Đã xóa thành công ${result.deletedCount} yêu cầu.`,
      });
    } else {
      res
        .status(404)
        .json({ success: false, message: "Không tìm thấy yêu cầu nào để xóa" });
    }
  } catch (error) {
    console.error("Lỗi khi xóa:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

export const createPending = async (req, res) => {
  try {
    const newImageFiles = req.files || [];
    const {
      actionType,
      targetGmailUser,
      newData,
      oldData,
      deletedImages,
      gmailUser,
    } = req.body;
    const parsedNewData = JSON.parse(newData);
    const parsedOldData = oldData ? JSON.parse(oldData) : null;
    const parsedDeletedImages = deletedImages ? JSON.parse(deletedImages) : [];
    const parsedGmailUser = JSON.parse(gmailUser);

    // --- BƯỚC A: VALIDATE ĐỊNH DẠNG DỮ LIỆU ---
    const schemaToUse =
      actionType === "add" ? createPersonSchema : updateUserProfileSchema;

    // Thêm tùy chọn để bỏ qua các trường không xác định khi thêm mới
    const validationOptions = {
      abortEarly: false,
      allowUnknown: true,
    };

    const { error } = schemaToUse.validate(parsedNewData, validationOptions);

    if (error) {
      console.error("Lỗi validation từ Joi:", error.details); // Log lỗi chi tiết
      const errorMessages = error.details.map((d) => d.message).join(", ");
      return res.status(400).json({
        success: false,
        message: `Dữ liệu không hợp lệ: ${errorMessages}`,
      });
    }

    // --- BƯỚC B: KIỂM TRA LOGIC NGHIỆP VỤ (TRÙNG LẶP & QUYỀN) ---
    if (actionType === "add") {
      // Khi thêm mới, kiểm tra xem CCCD đã tồn tại chưa
      const existingPersonByIdNumber = await personModel.findOne({
        "idNumber.value": parsedNewData.idNumber.value,
      });

      if (existingPersonByIdNumber) {
        return res.status(409).json({
          // 409 Conflict: Dữ liệu bị xung đột
          success: false,
          message: `Số CCCD '${parsedNewData.idNumber.value}' đã tồn tại trong hệ thống.`,
        });
      }
    } else {
      // Khi chỉnh sửa, kiểm tra quyền editable
      const currentPerson = await personModel.findOne({
        "gmailUser.value": targetGmailUser,
      });

      if (!currentPerson) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy người dùng để cập nhật.",
        });
      }

      for (const field in parsedNewData) {
        if (currentPerson[field] && currentPerson[field].editable === false) {
          const originalValue = currentPerson[field].value;
          const newValue = parsedNewData[field].value;

          if (JSON.stringify(originalValue) !== JSON.stringify(newValue)) {

            
            return res.status(403).json({
              success: false,
              message: `Bạn không có quyền chỉnh sửa trường '${field}'. Vui lòng tải lại trang.`,
            });
          }
        }
      }
    }
    // --- KẾT THÚC KIỂM TRA LOGIC NGHIỆP VỤ ---

    const newImageUrls = [];
    if (newImageFiles.length > 0) {
      for (const file of newImageFiles) {
        const result = await uploadToCloudinary(file.buffer);
        if (result && result.secure_url) {
          newImageUrls.push(result.secure_url);
        }
      }
    }

    const remainingOldImages = parsedNewData.image?.value || [];
    const finalImageUrls = [...remainingOldImages, ...newImageUrls];
    parsedNewData.image.value = finalImageUrls;

    const creationPayload = {
      gmailUser: { value: parsedGmailUser.value },
      actionType: actionType,
      targetCollection: "persons",
      targetGmailUser: targetGmailUser || null,
      newData: parsedNewData,
      oldData: parsedOldData,
      deletedImages: parsedDeletedImages,
    };

    const pendingRequest = await pendingModel.create(creationPayload);

    // Gửi email thông báo cho admin
    const adminEmail = "thenghia1906@gmail.com";
    const subject = `[Thông báo] Yêu cầu pending mới: ${actionType}`;
    const html = `
        <p>Xin chào quản trị viên,</p><br/>
        <p>Có một yêu cầu ${actionType === "add" ? "thêm mới" : "chỉnh sửa"} từ người dùng <strong>${parsedGmailUser.value}</strong>.</p>
        <p>Vui lòng đăng nhập vào trang quản lý để xem xét và xử lý yêu cầu này.</p>
        <p>Trân trọng!</p>
      `;
    // Nếu sendEmail gặp lỗi, nó sẽ được bắt ở đây
    await sendEmail(adminEmail, subject, html);

    res.status(201).json({
      success: true,
      message: "Gửi yêu cầu thành công",
      data: pendingRequest,
    });
  } catch (err) {
    console.error("Lỗi nghiêm trọng trong createPending:", err);
    res
      .status(500)
      .json({ success: false, message: "Lỗi máy chủ", error: err.message });
  }
};

export const reviewPending = async (req, res) => {
  const { pendingId, status, reviewer } = req.body;

  if (!pendingId || !status || !["approved", "rejected"].includes(status)) {
    return res
      .status(400)
      .json({ success: false, message: "Dữ liệu không hợp lệ." });
  }

  try {
    const pending = await pendingModel.findById(pendingId);
    if (!pending) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy yêu cầu." });
    }
    if (pending.status !== "pending") {
      return res
        .status(400)
        .json({ success: false, message: "Yêu cầu đã được xử lý." });
    }

    const imageUrlsInNewData = pending.newData.image?.value || [];
    const deletedImageUrls = pending.deletedImages || [];
    const userEmail = pending.gmailUser.value;

    if (status === "rejected") {
      const imagesToDelete = imageUrlsInNewData.filter((url) =>
        url.includes("pending_uploads")
      );
      await deleteImagesFromCloudinary(imagesToDelete);

      const subject = `Yêu cầu của bạn đã bị từ chối`;
      const html = `
      <p>Xin chào,</p>
      <p>Ban CHQS Phường Cái Răng thông báo</p><br/>
      <p>Yêu cầu <strong>${pending.actionType === "add" ? "thêm mới" : "chỉnh sửa"}</strong> của bạn đã bị <strong style="color:red;">từ chối</strong>.</p>
      <p>Vui lòng liên hệ quản trị viên để biết thêm chi tiết.</p><br/>
      <p>Trân trọng!</p>`;
      await sendEmail(userEmail, subject, html);
      await pendingModel.findByIdAndDelete(pendingId);
      return res
        .status(200)
        .json({ success: true, message: "Yêu cầu đã được từ chối." });
    }

    if (status === "approved") {
      if (pending.actionType === "add") {
        const existing = await personModel.findOne({
          "gmailUser.value": pending.newData.gmailUser.value.trim(),
        });
        if (existing) {
          return res.status(400).json({
            success: false,
            message: "Người dùng đã tồn tại. Yêu cầu chưa được xử lý.",
          });
        }
      } else if (pending.actionType === "edit") {
        const existing = await personModel.findOne({
          "gmailUser.value": pending.targetGmailUser,
        });
        if (!existing) {
          return res.status(404).json({
            success: false,
            message:
              "Không tìm thấy người dùng cần sửa. Yêu cầu chưa được xử lý.",
          });
        }
      }

      await deleteImagesFromCloudinary(deletedImageUrls);
      const finalImageUrls = await moveImagesInCloudinary(imageUrlsInNewData);

      const finalData = { ...pending.newData };
      finalData.image.value = finalImageUrls;

      if (pending.actionType === "add") {
        await personModel.create(finalData);
      } else if (pending.actionType === "edit") {
        await personModel.findOneAndUpdate(
          { "gmailUser.value": pending.targetGmailUser },
          { $set: finalData }
        );
      }

      pending.status = "approved";
      pending.reviewedAt = new Date();
      pending.reviewer = reviewer || "PhD Nghĩa";
      await pending.save();

      const subject = `Yêu cầu của bạn đã được chấp thuận`;
      const html = `
      <p>Xin chào,</p>
      <p>Ban CHQS Phường Cái Răng thông báo</p><br/>
      <p>Yêu cầu <strong>${pending.actionType === "add" ? "thêm mới" : "chỉnh sửa"}</strong> thông tin của bạn đã <strong style="color:green;">được duyệt</strong>.</p>
      <p>Cảm ơn bạn đã cung cấp thông tin.</p><br/>
      <p>Trân trọng!</p>`;
      await sendEmail(userEmail, subject, html);

      return res
        .status(200)
        .json({ success: true, message: "Yêu cầu đã được duyệt thành công." });
    }
  } catch (error) {
    console.error("Lỗi nghiêm trọng trong reviewPending:", error);
    return res
      .status(500)
      .json({ success: false, message: "Lỗi máy chủ nội bộ." });
  }
};
