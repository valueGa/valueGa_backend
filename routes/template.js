const express = require('express');
const router = express.Router();
const { TEMPLATES } = require('../models');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const excelFilePath = path.join(__dirname, `./upload/a.xlsx`);
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// 엑셀 파일을 입력받아 binary화 하여 템플릿으로 저장하는 API
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

// template id에 해당하는 template를 조회하는 API
router.get('/:template_id', async (req, res) => {
  /* 
    #swagger.description = '템플릿 불러오기'
    #swagger.tags = ['Templates']
  */
  const { template_id } = req.params;

  try {
    const template = await TEMPLATES.findOne({
      where: {
        template_id: template_id,
      },
    });

    res.status(200).json(template);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: '템플릿화 실패' });
  }
});

module.exports = router;
