import mongoose from "mongoose";

const legalDocumentSchema = new mongoose.Schema(
  {
    // Liên kết đến văn bản cha (quan trọng cho việc tạo menu con)
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LegalDocument", // Tham chiếu đến chính model này
      default: null, // Sẽ là null nếu đây là văn bản gốc
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    documentCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    documentType: {
      type: String,
      required: true,
      enum: ["Luật", "Nghị định", "Thông tư", "Nghị quyết", "Quyết định"],
    },
    issuingBody: {
      type: String,
      required: true,
      trim: true,
    },
    issueDate: {
      type: Date,
      required: true,
    },
    effectiveDate: {
      type: Date,
      required: true,
    },
    summary: {
      type: String,
      required: false,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: false,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    // Tự động thêm hai trường createdAt và updatedAt
    timestamps: true,
  }
);

const LegalDocument =
  mongoose.models.LegalDocument ||
  mongoose.model("LegalDocument", legalDocumentSchema);

export default LegalDocument;
