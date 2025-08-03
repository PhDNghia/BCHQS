import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    default: "global_settings",
  },

  isMaintenanceMode: {
    type: Boolean,
    default: false,
  },

  maintenanceMessage: {
    type: String,
    default:
      "Hệ thống đang được bảo trì để nâng cấp. Vui lòng quay lại sau ít phút.",
  },
});

const settingsModel =
  mongoose.models.settings || mongoose.model("settings", settingsSchema);

export default settingsModel;
