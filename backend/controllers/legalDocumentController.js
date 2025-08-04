import LegalDocument from "../models/legalDocumentModel.js";
import cloudinary from "../config/cloudinary.js";

// Hàm tải file lên Cloudinary
const uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: folder, resource_type: "auto" },
      (error, result) => {
        if (error) reject(error);
        resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};

// Hàm xóa file khỏi Cloudinary (Sửa lỗi logic)
const deleteFromCloudinary = async (fileUrl) => {
  if (!fileUrl || !fileUrl.includes("cloudinary")) return;
  try {
    // Trích xuất public_id bao gồm cả thư mục từ URL
    // Ví dụ: .../upload/v12345/legal_documents/abcxyz.pdf -> legal_documents/abcxyz
    const publicIdWithFolder = fileUrl
      .split("/")
      .slice(-2)
      .join("/")
      .split(".")[0];

    await cloudinary.uploader.destroy(publicIdWithFolder);
    console.log(`Đã xóa file cũ trên Cloudinary: ${publicIdWithFolder}`);
  } catch (deleteError) {
    console.error("Lỗi khi xóa file cũ trên Cloudinary:", deleteError);
  }
};

// Hàm tạo mới
const createDocument = async (req, res) => {
  try {
    const { documentCode, slug, ...otherData } = req.body;

    const existingDocument = await LegalDocument.findOne({
      $or: [{ documentCode }, { slug }],
    });
    if (existingDocument) {
      return res.status(400).json({ message: "Số hiệu hoặc slug đã tồn tại." });
    }

    // req.files sẽ là một object: { pdfFile: [file], imageFile: [file] }
    const pdfFile = req.files?.pdfFile?.[0];
    const imageFile = req.files?.imageFile?.[0];
    let fileUrlResult = "";
    let imageUrlResult = "";

    // Tải file PDF (nếu có)
    if (pdfFile) {
      const result = await uploadToCloudinary(
        pdfFile.buffer,
        "legal_documents"
      );
      fileUrlResult = result.secure_url;
    }

    // Tải file ảnh (nếu có)
    if (imageFile) {
      const result = await uploadToCloudinary(
        imageFile.buffer,
        "legal_documents"
      );
      imageUrlResult = result.secure_url;
    }

    // Gộp dữ liệu lại
    const newDocumentData = {
      ...otherData,
      documentCode,
      slug,
      fileUrl: fileUrlResult,
      imageUrl: imageUrlResult,
    };

    const newDocument = new LegalDocument(newDocumentData);
    await newDocument.save();
    res.status(201).json(newDocument);
  } catch (error) {
    console.error("Lỗi khi tạo văn bản:", error);
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

// HÀM CẬP NHẬT VĂN BẢN (ĐÃ ĐỒNG BỘ)
const updateDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    console.log(updateData);

    const existingDocument = await LegalDocument.findById(id);
    if (!existingDocument) {
      return res.status(404).json({ message: "Không tìm thấy văn bản." });
    }

    const newPdfFile = req.files?.pdfFile?.[0];
    const newImageFile = req.files?.imageFile?.[0];

    // 1. Xử lý file PDF (nếu có file mới)
    if (newPdfFile) {
      console.log("Có file PDF mới, đang tải lên Cloudinary...");
      // Xóa file PDF cũ TRƯỚC KHI tải file mới lên
      await deleteFromCloudinary(existingDocument.fileUrl);
      const result = await uploadToCloudinary(
        newPdfFile.buffer,
        "legal_documents"
      );
      updateData.fileUrl = result.secure_url;
      console.log("Tải file PDF mới thành công, URL:", updateData.fileUrl);
    }

    // 2. Xử lý file Hình ảnh (nếu có file mới)
    if (newImageFile) {
      console.log("Có file ảnh mới, đang tải lên Cloudinary...");
      // Xóa ảnh cũ TRƯỚC KHI tải ảnh mới lên
      await deleteFromCloudinary(existingDocument.imageUrl);
      const result = await uploadToCloudinary(
        newImageFile.buffer,
        "legal_documents"
      );
      updateData.imageUrl = result.secure_url;
      console.log("Tải file ảnh mới thành công, URL:", updateData.imageUrl);
    }

    // 3. Cập nhật văn bản trong DB
    const updatedDocument = await LegalDocument.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json(updatedDocument);
  } catch (error) {
    console.error("Lỗi khi cập nhật văn bản:", error);
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

// LẤY TẤT CẢ VĂN BẢN (CÓ PHÂN TRANG)
const getAllDocuments = async (req, res) => {
  try {
    const pageSize = 10;
    const page = Number(req.query.page) || 1;
    const count = await LegalDocument.countDocuments();
    const documents = await LegalDocument.find()
      .limit(pageSize)
      .skip(pageSize * (page - 1));
    res.json({
      documents,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

// LẤY VĂN BẢN THEO ID
const getDocumentById = async (req, res) => {
  try {
    // SỬA LỖI: Lấy 'id' từ req.params thay vì req.body
    const { id } = req.params;
    const document = await LegalDocument.findById(id).populate(
      "parentId",
      "title documentCode"
    );
    if (document) {
      res.json(document);
    } else {
      res.status(404).json({ message: "Không tìm thấy văn bản." });
    }
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

// XÓA VĂN BẢN
const deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Tìm văn bản trong DB để lấy URL của file và ảnh
    const documentToDelete = await LegalDocument.findById(id);

    if (!documentToDelete) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy văn bản để xóa." });
    }

    // 2. Xóa file PDF khỏi Cloudinary (nếu có)
    if (documentToDelete.fileUrl) {
      await deleteFromCloudinary(documentToDelete.fileUrl);
    }

    // 3. Xóa hình ảnh khỏi Cloudinary (nếu có)
    if (documentToDelete.imageUrl) {
      await deleteFromCloudinary(documentToDelete.imageUrl);
    }

    // 4. Sau khi xóa file, xóa bản ghi khỏi DB
    await LegalDocument.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Xóa văn bản và các file đính kèm thành công.",
    });
  } catch (error) {
    console.error("Lỗi khi xóa văn bản:", error);
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

export {
  createDocument,
  updateDocument,
  deleteDocument,
  getAllDocuments,
  getDocumentById,
};
