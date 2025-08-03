import settingsModel from "../models/settingsModel.js";

export const maintenanceCheck = async (req, res, next) => {
  try {
    const settings = await settingsModel.findOne({ key: "global_settings" });
    if (!settings || !settings.isMaintenanceMode) {
      return next();
    }
    const userEmail = req.auth?.sessionClaims?.email_address;

    const adminEmail = (process.env.ADMIN_EMAIL_TEST_FE || "").split(",");

    console.log(userEmail, adminEmail);

    if (userEmail && adminEmail.includes(userEmail)) {
      return next();
    }

    return res.status(503).json({
      isMaintenance: true,
      message: settings.maintenanceMessage,
    });
  } catch (error) {
    next();
  }
};
