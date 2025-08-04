import { sendEmail } from "../config/emailService.js";
import personModel from "../models/personModel.js";
import settingsModel from "../models/settingsModel.js";

export const updateMaintenanceMode = async (req, res) => {
  const { enable, message } = req.body;

  if (typeof enable !== "boolean") {
    return res.status(400).json({
      success: false,
      error: 'Trường "enable" phải là true hoặc false.',
    });
  }

  try {
    const updateData = { isMaintenanceMode: enable };
    if (message) {
      updateData.maintenanceMessage = message;
    }

    const settings = await settingsModel.findOneAndUpdate(
      { key: "global_settings" },
      updateData,
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: `Chế độ bảo trì đã được ${enable ? "BẬT" : "TẮT"}.`,
      data: settings,
    });

    // Chạy tác vụ gửi email trong nền
    (async () => {
      try {
        const allUsers = await personModel.find({}, "gmailUser.value");
        if (allUsers.length === 0) return;

        const recipients = allUsers.map((user) => user.gmailUser.value);

        let subject, html;

        if (enable) {
          subject = "Thông Báo Bảo Trì Hệ Thống";
          html = `
              <p>Xin chào,</p>
              <p>Ban CHQS Phường Cái Răng thông báo !!!</p><br/>
              <p>Hệ thống <b>đang được bảo trì</b> để cập nhật tính năng.</p>
              <p>Vui lòng liên hệ bchqsphuongcairang@gmail.com nếu có việc cần gấp</p>
              <br/>
              <p>Xin lỗi vì sự bất tiện này</p>
              <p>Trân trọng!</p>`;
        } else {
          subject = "Thông Báo: Hệ Thống Hoạt Động Trở Lại";
          html = `
              <p>Xin chào,</p>
              <p>Ban CHQS Phường Cái Răng thông báo !!!</p><br/>
              <p>Hệ thống <b>đã được bảo trì</b> thành công.</p>
              <p><a href="https://banchqsphuongcairang.com">https://banchqsphuongcairang.com</a></p>
              <br/>
              <p>Trân trọng!</p>`;
        }

        // 2. Sửa lại cách gọi hàm cho khớp với hàm của bạn
        await sendEmail(recipients, subject, html);
      } catch (emailError) {
        // Lỗi này sẽ được in ra ở terminal của backend
        console.error(
          "Lỗi từ emailService khi gửi email hàng loạt:",
          emailError
        );
      }
    })();
  } catch (error) {
    res.status(500).json({ success: false, error: "Lỗi máy chủ." });
  }
};

export const getMaintenanceStatus = async (req, res) => {
  try {
    const settings = await settingsModel.findOne({ key: "global_settings" });

    // Nếu không có cài đặt, mặc định là không bảo trì
    if (!settings) {
      return res.status(200).json({
        isMaintenance: false,
        message: "Hệ thống đang hoạt động.",
      });
    }

    res.status(200).json({
      isMaintenance: settings.isMaintenanceMode,
      message: settings.maintenanceMessage,
    });
    
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};
