import Joi from "joi";

// --- SCHEMA CƠ SỞ ---
const fieldSchema = (type) =>
  Joi.object({ value: type, editable: Joi.boolean().optional() });

// --- SCHEMA KHI TẠO MỚI ---
export const createPersonSchema = Joi.object({
  name: fieldSchema(Joi.string().trim().min(2).max(50).required()),
  birth: fieldSchema(
    Joi.string()
      .pattern(
        /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/,
        "dd/MM/yyyy"
      )
      .required()
  ),
  sex: fieldSchema(Joi.string().valid("Nam", "Nữ").required()),
  idNumber: fieldSchema(
    Joi.string()
      .pattern(/^[0-9]{9}$|^[0-9]{12}$/)
      .required()
  ),
  occupation: fieldSchema(Joi.string().min(2).required()),
  permanentAddress: fieldSchema(Joi.string().min(5).required()),
  temporaryAddress: fieldSchema(Joi.string().min(5).required()),
  ethnicity: fieldSchema(Joi.string().required()),
  religion: fieldSchema(Joi.string().required()),
  educationLevel: fieldSchema(
    Joi.string()
      .pattern(/^(0?[1-9]|1[0-2])\/12$/)
      .required()
  ),
  professionalLevel: fieldSchema(Joi.string().required()),
  education: fieldSchema(Joi.string().required()),
  phone: fieldSchema(
    Joi.string()
      .pattern(/^(0?)(3|5|7|8|9|1[2|6|8|9])+([0-9]{8})$/)
      .required()
  ),
  category: fieldSchema(Joi.string().required()),
  categoryReason: fieldSchema(Joi.string().required()),
  gmailUser: fieldSchema(Joi.string().email().required()),
  wife: fieldSchema(Joi.string().allow("").required()),
  children: fieldSchema(Joi.string().allow("").required()),
  fatherInfo: fieldSchema(Joi.string().allow("").optional()),
  motherInfo: fieldSchema(Joi.string().allow("").optional()),
  siblings: fieldSchema(Joi.string().allow("").optional()),
});

export const updateUserProfileSchema = Joi.object({
  name: fieldSchema(Joi.string().trim().min(2).max(50).optional()),
  birth: fieldSchema(
    Joi.string()
      .pattern(
        /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/,
        "dd/MM/yyyy"
      )
      .optional()
  ),
  sex: fieldSchema(Joi.string().valid("Nam", "Nữ").optional()),
  idNumber: fieldSchema(
    Joi.string()
      .pattern(/^[0-9]{9}$|^[0-9]{12}$/)
      .optional()
  ),
  occupation: fieldSchema(Joi.string().min(2).optional()),
  permanentAddress: fieldSchema(Joi.string().min(5).optional()),
  temporaryAddress: fieldSchema(Joi.string().min(5).optional()),
  ethnicity: fieldSchema(Joi.string().optional()),
  religion: fieldSchema(Joi.string().optional()),
  educationLevel: fieldSchema(
    Joi.string()
      .pattern(/^(0?[1-9]|1[0-2])\/12$/)
      .optional()
  ),
  professionalLevel: fieldSchema(Joi.string().optional()),
  wife: fieldSchema(Joi.string().allow("").optional()),
  children: fieldSchema(Joi.string().allow("").optional()),
  fatherInfo: fieldSchema(Joi.string().allow("").optional()),
  motherInfo: fieldSchema(Joi.string().allow("").optional()),
  siblings: fieldSchema(Joi.string().allow("").optional()),
  education: fieldSchema(Joi.string().optional()),
  phone: fieldSchema(
    Joi.string()
      .pattern(/^(0?)(3|5|7|8|9|1[2|6|8|9])+([0-9]{8})$/)
      .optional()
      .allow("")
  ),
});

// --- SCHEMA KHI ADMIN CẬP NHẬT ---
export const adminUpdatePersonSchema = Joi.object({
  name: fieldSchema(Joi.string().trim().min(2).max(50).optional()),
  birth: fieldSchema(
    Joi.string()
      .pattern(
        /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/,
        "dd/MM/yyyy"
      )
      .optional()
  ),
  sex: fieldSchema(Joi.string().valid("Nam", "Nữ").optional()),
  idNumber: fieldSchema(
    Joi.string()
      .pattern(/^[0-9]{9}$|^[0-9]{12}$/)
      .optional()
  ),
  occupation: fieldSchema(Joi.string().min(2).optional()),
  permanentAddress: fieldSchema(Joi.string().min(5).optional()),
  temporaryAddress: fieldSchema(Joi.string().min(5).optional()),
  ethnicity: fieldSchema(Joi.string().optional()),
  religion: fieldSchema(Joi.string().optional()),
  educationLevel: fieldSchema(
    Joi.string()
      .pattern(/^(0?[1-9]|1[0-2])\/12$/)
      .optional()
  ),
  professionalLevel: fieldSchema(Joi.string().optional()),
  education: fieldSchema(Joi.string().optional()),
  phone: fieldSchema(
    Joi.string()
      .pattern(/^(0?)(3|5|7|8|9|1[2|6|8|9])+([0-9]{8})$/)
      .optional()
      .allow("")
  ),
  category: fieldSchema(Joi.string().optional()),
  categoryReason: fieldSchema(Joi.string().optional()),
  gmailUser: fieldSchema(Joi.string().email().optional()),
  wife: fieldSchema(Joi.string().allow("").optional()),
  children: fieldSchema(Joi.string().allow("").optional()),
  fatherInfo: fieldSchema(Joi.string().allow("").optional()),
  motherInfo: fieldSchema(Joi.string().allow("").optional()),
  siblings: fieldSchema(Joi.string().allow("").optional()),

  // SỬA LỖI: Nới lỏng quy tắc validation cho image.value
  image: Joi.object({
    value: Joi.array().optional(), // Chỉ cần là một mảng, không cần kiểm tra từng URL
    editable: Joi.boolean().optional(),
  }).optional(),
});
