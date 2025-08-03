// backend/utils/emailService.js
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Gửi email đơn giản bằng Resend
 * @param {string} to Email người nhận
 * @param {string} subject Tiêu đề
 * @param {string} html Nội dung HTML
 */
export const sendEmail = async (to, subject, html) => {
  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("Lỗi gửi email:", error);
    throw error;
  }
};
