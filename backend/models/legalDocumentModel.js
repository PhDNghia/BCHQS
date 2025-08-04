import mongoose from "mongoose";

const legalDocumentSchema = new mongoose.Schema(
  {
    mainLawCategory: {
      type: String,
      required: true,
      trim: true,
    },
    // BỔ SUNG: Trường 'field' (Lĩnh vực)
    field: {
      type: String,
      required: true,
      trim: true,
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
      enum: [
        "Luật",
        "Nghị định",
        "Thông tư",
        "Quyết định",
        "Nghị quyết",
        "Khác",
      ],
    },
    issuingBody: {
      type: String,
      required: true,
      trim: true,
    },
    signer: {
      type: String,
      required: false,
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
    status: {
      type: String,
      required: true,
      enum: [
        "Còn hiệu lực",
        "Hết hiệu lực",
        "Bị thay thế",
        "Bị bãi bỏ",
        "Chưa có hiệu lực",
      ],
      default: "Còn hiệu lực",
    },
    summary: {
      type: String,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: false,
    },
    // BỔ SUNG: Trường 'imageUrl'
    imageUrl: {
      type: String,
      required: false,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LegalDocument",
      default: null,
    },
    relatedDocuments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LegalDocument",
      },
    ],
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const LegalDocument =
  mongoose.models.LegalDocument ||
  mongoose.model("LegalDocument", legalDocumentSchema);

export default LegalDocument;
