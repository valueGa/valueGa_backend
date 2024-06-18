const express = require("express");
const router = express.Router();
const { USER_TEMPLATES, USER_TEMPLATE_TEMPORARIES } = require("../models");

const multer = require("multer");
const fs = require("fs");
const path = require("path");

router.get("/", async (req, res) => {
  // #swagger.description = 'valuation 3개년 데이터 가져오기'
  // #swagger.tags = ['Valuations']
  res.json({ message: "valuation 성공" });
});

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

router.post("/save", upload.single("file"), async (req, res) => {
  /*
        #swagger.description = 'user의 template 저장 및 valueBoard에 목표 주가 및 상승 여력 저장'
        #swagger.tags = ['Valuations']
        #swagger.consumes = ['multipart/form-data']
        #swagger.parameters['singleFile'] = {
            in: 'formData',
            type: 'file',
            required: 'true',
            description: '엑셀파일 업로드',
    } */

  const { user_id, stock_id, target_price, value_potential, template_id } =
    req.body;
  const file = req.file;

  if (
    !file ||
    !user_id ||
    !stock_id ||
    !target_price ||
    !value_potential ||
    !template_id
  ) {
    return res.status(400).send("데이터가 비었어요");
  }
  try {
    const fileContent = fs.readFileSync(excelFilePath);

    await USER_TEMPLATES.create({
      user_id: user_id,
      stock_id: stock_id,
      excel_data: fileContent,
    });

    await VALUE_BOARDS.create({
      user_id: user_id,
      stock_id: stock_id,
      template_id: template_id, // templates 테이블의 template_id 참조?
      target_price: target_price,
      value_potential: value_potential,
    });

    res.status(200).send("템플릿과 목표 주가 저장 완료");
  } catch (error) {
    console.error("저장 중 에러: ", error);
    res.status(500).send("저장 중 에러");
  }
});

router.post("/temporary-save", upload.single("file"), async (req, res) => {
  /*
        #swagger.description = 'user의 template 임시 저장'
        #swagger.tags = ['Valuations']
        #swagger.consumes = ['multipart/form-data']
        #swagger.parameters['singleFile'] = {
            in: 'formData',
            type: 'file',
            required: 'true',
            description: '엑셀파일 업로드',
    } */

  const { user_id, stock_id } = req.body;
  const file = req.file;

  if (!file || !user_id || !stock_id) {
    return res.status(400).send("파일이 없어요");
  }

  if (!stock_id) {
    return res.status(400).send("종목이 뭐에요");
  }

  try {
    const templateCount = await USER_TEMPLATE_TEMPORARIES.count({
      where: { user_id: user_id },
    });

    if (templateCount >= 3) {
      return res
        .status(400)
        .json({ message: "템플릿 저장 개수는 최대 3개입니다!" });
    }

    const fileContent = fs.readFileSync(excelFilePath);

    await USER_TEMPLATE_TEMPORARIES.create({
      user_id: user_id,
      stock_id: stock_id,
      excel_data: fileContent,
    });

    console.log("템플릿 저장 완료");
    res.status(200).send("템플릿 저장 완료");
  } catch (error) {
    console.error("템플릿 저장 중 에러", error);
    res.status(500).send("템플릿 저장 중 에러");
  }
});

router.get("/download/:id", async (req, res) => {
  // #swagger.description = 'user의 template 다운로드'
  // #swagger.tags = ['Valuations']
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
        console.log("파일 전송 완료");
      }
    });
  } catch (error) {
    console.error("파일 다운로드 중 에러", error);
    res.status(500).send("파일 다운로드 중 에러");
  }
});

module.exports = router;
