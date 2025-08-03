import mongoose from "mongoose";

const personSchema = new mongoose.Schema({
  name: {
    value: { type: String, required: true, trim: true },
    editable: { type: Boolean, default: true },
  },
  birth: {
    value: { type: String, required: true },
    editable: { type: Boolean, default: true },
  },
  sex: {
    value: { type: String, required: true },
    editable: { type: Boolean, default: true },
  },
  image: {
    value: { type: [String], required: true },
    editable: { type: Boolean, default: true },
  },
  idNumber: {
    value: { type: String, required: true },
    editable: { type: Boolean, default: true },
  },
  occupation: {
    value: { type: String, required: true },
    editable: { type: Boolean, default: true },
  },
  permanentAddress: {
    value: { type: String, required: true },
    editable: { type: Boolean, default: true },
  },
  temporaryAddress: {
    value: { type: String, required: true },
    editable: { type: Boolean, default: true },
  },
  ethnicity: {
    value: { type: String, required: true },
    editable: { type: Boolean, default: true },
  },
  religion: {
    value: { type: String, required: true },
    editable: { type: Boolean, default: true },
  },
  educationLevel: {
    value: { type: String, required: true },
    editable: { type: Boolean, default: true },
  },
  professionalLevel: {
    value: { type: String, required: true },
    editable: { type: Boolean, default: true },
  },
  wife: {
    value: { type: String, required: true, default: "Chưa có" },
    editable: { type: Boolean, default: true },
  },
  children: {
    value: { type: String, required: true, default: "Chưa có" },
    editable: { type: Boolean, default: true },
  },
  fatherInfo: {
    value: { type: String },
    editable: { type: Boolean, default: true },
  },
  motherInfo: {
    value: { type: String },
    editable: { type: Boolean, default: true },
  },
  siblings: {
    value: { type: String },
    editable: { type: Boolean, default: true },
  },
  education: {
    value: { type: String, required: true },
    editable: { type: Boolean, default: true },
  },
  phone: {
    value: { type: String, required: true },
    editable: { type: Boolean, default: true },
  },
  category: {
    value: { type: String, required: true, default: "Đủ điều kiện" },
    editable: { type: Boolean, default: true },
  },
  categoryReason: {
    value: { type: String, required: true, default: "Đủ điều kiện khám lần 1" },
    editable: { type: Boolean, default: true },
  },
  gmailUser: {
    value: { type: String, required: true },
    editable: { type: Boolean, default: true },
  },
  date: {
    value: { type: Date, required: true },
    editable: { type: Boolean, default: true },
  },
});

const personModel =
  mongoose.models.person || mongoose.model("person", personSchema);

export default personModel;
