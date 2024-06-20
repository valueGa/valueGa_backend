const express = require('express');
const router = express.Router();
const { TEMPLATES } = require('../models');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const excelFilePath = path.join(__dirname, `./uploads/a.xlsx`);
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/', upload.single('file'), async (req, res) => {
  /* 
      #swagger.description = '템플릿화'
      #swagger.tags = ['Templates']
      #swagger.consumes = ['multipart/form-data']
      #swagger.parameters['file'] = {
            in: 'files',
            type: 'file',
            required: 'true',
            description: '엑셀파일 업로드',
          }
    */
  const file = req.file;
  const { template_name, user_id } = req.body;

  if (!file) {
    return res.status(400).send('파일이 없습니다.');
  }

  try {
    const fileContent = fs.readFileSync(excelFilePath);

    const newTemplate = await TEMPLATES.create({
      template_name: template_name,
      user_id: user_id,
      excel_data: fileContent,
    });

    res.status(200).json(newTemplate);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: '템플릿화 실패' });
  }
});

module.exports = router;
