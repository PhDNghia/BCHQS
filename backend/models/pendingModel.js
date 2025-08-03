import mongoose from "mongoose";

const pendingSchema = new mongoose.Schema({
  gmailUser: {
    value: { type: String, required: true },
    editable: { type: Boolean, default: false },
  }, // người gửi request
  actionType: { type: String, enum: ["add", "edit"], required: true },
  targetCollection: { type: String, required: true }, // "users"
  targetGmailUser: { type: String, default: null }, // email user cần sửa (null nếu add mới)
  newData: { type: Object, required: true },
  oldData: { type: Object }, // <-- thêm trường dữ liệu cũ
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  deletedImages: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
  reviewedAt: { type: Date },
  reviewer: { type: String, default: "PhD Nghĩa" }, // admin email/id
});

const pendingModel =
  mongoose.models.pending || mongoose.model("pending", pendingSchema);

export default pendingModel;
