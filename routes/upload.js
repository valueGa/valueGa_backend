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

// POST 요청: 파일 업로드
// #swagger.description = 'user의 template 저장'
// #swagger.tags = ['Templates']
router.post("/", upload.single("file"), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).send("No file uploaded");
  }

  try {
    const fileContent = fs.readFileSync(excelFilePath);
    console.log(fileContent);

    // const binaryContent = Buffer.from(fileContent).toString("binary");

    await USER_TEMPLATES.create({
      user_id: 1,
      stock_id: 1,
      created_date: new Date(),
      excel_data: fileContent,
    });
    console.log("파일업로드완");
    res.status(200).send("파일 업로드완");
  } catch (error) {
    console.error("Error processing file:", error);
  }
});

module.exports = router;

// GET 요청: 바이너리 데이터를 엑셀 파일로 복원하고 다운로드
// #swagger.description = 'user의 template 다운로드'
// #swagger.tags = ['Templates']
router.get("/download/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const template = await USER_TEMPLATES.findByPk(id);

    if (!template) {
      return res.status(404).send("템플릿 없음");
    }

    const binaryContent = template.excel_data;

    const outputPath = path.join(__dirname, `./uploads/restored_a.xlsx`);
    fs.writeFileSync(outputPath, binaryContent);

    res.download(outputPath, "restored_a.xlsx", (err) => {
      if (err) {
        console.error("파일 다운로드 중 에러:", err);
        res.status(500).send("파일 전송 중 에러");
      } else {
        console.log("파일 전송완");
      }
    });
  } catch (error) {
    console.error("파일 다운로드 중 에러", error);
    res.status(500).send("파일 다운로드 중 에러");
  }
});
