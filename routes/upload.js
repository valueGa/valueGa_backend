const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { USER_TEMPLATE_TEMPORARY } = require('../models');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, './uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `a.xlsx`);
  },
});

const excelFilePath = path.join(__dirname, `./uploads/a.xlsx`);
const outputFilePath = path.join(__dirname, './uploads/abx_binary.txt');
const upload = multer({ storage: storage });

router.post('/', upload.single('file'), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).send('No file uploaded');
  }

  try {
    const fileContent = fs.readFileSync(excelFilePath, 'utf-8');

    const binaryContent = Buffer.from(fileContent, 'utf-8').toString('binary');
  } catch (error) {
    console.error('Error processing file:', error);
  }

  try {
    await USER_TEMPLATE_TEMPORARY.create({
      user_id: 1,
      stock_id: 1,
      template_name: file.originalname,
      created_date: new Date(),
      updated_date: new Date(),
      excel_data: binaryContent,
    });

    res
      .status(200)
      .send('File uploaded, converted, and saved to database and disk');
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).send('Error processing file');
  }
});

module.exports = router;
