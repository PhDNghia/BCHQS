import LegalDocument from "../models/legalDocumentModel.js";

const createDocument = async (req, res) => {
  try {
    const { documentCode, slug } = req.body;
    const existingDocument = await LegalDocument.findOne({
      $or: [{ documentCode }, { slug }],
    });
    if (existingDocument) {
      return res.status(400).json({ message: "Số hiệu hoặc slug đã tồn tại." });
    }
    const newDocument = new LegalDocument(req.body);

    const savedDocument = await newDocument.save();
    res.status(201).json(savedDocument);
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

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

const getDocumentById = async (req, res) => {
  try {
    const { id } = req.body;
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

const updateDocument = async (req, res) => {
  try {
    const { id, ...updateData } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ message: "Vui lòng cung cấp ID của văn bản." });
    }

    const document = await LegalDocument.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!document) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy văn bản với ID đã cho." });
    }

    res.status(200).json(document);
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

const deleteDocument = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ message: "Vui lòng cung cấp ID của văn bản." });
    }

    const document = await LegalDocument.findByIdAndDelete(id);

    if (!document) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy văn bản với ID đã cho." });
    }

    res.status(200).json({ message: "Xóa văn bản thành công." });
  } catch (error) {
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
