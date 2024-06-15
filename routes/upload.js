const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { USER_TEMPLATES } = require("../models");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "./uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, `a.xlsx`);
  },
});

const excelFilePath = path.join(__dirname, `./uploads/a.xlsx`);
const outputFilePath = path.join(__dirname, "./uploads/abx_binary.txt");
const upload = multer({ storage: storage });

router.post("/", upload.single("file"), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).send("No file uploaded");
  }

  try {
    const fileContent = fs.readFileSync(excelFilePath);

    const binaryContent = Buffer.from(fileContent).toString("binary");

    await USER_TEMPLATES.create({
      user_id: 1,
      stock_id: 1,
      created_date: new Date(),
      excel_data: binaryContent,
    });
    console.log("파일업로드완");
    res.status(200).send("파일 업로드완");
  } catch (error) {
    console.error("Error processing file:", error);
  }
});

module.exports = router;
