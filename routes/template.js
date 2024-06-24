const express = require('express');
const router = express.Router();
const { TEMPLATES } = require('../models');

// 템플릿으로 저장하는 API
router.post('/', async (req, res) => {
  /* 
      #swagger.description = '템플릿화'
      #swagger.tags = ['Templates']
    */

  const { template_name, user_id, excel_data } = req.body;

  try {
    const newTemplate = await TEMPLATES.create({
      template_name: template_name,
      user_id: user_id,
      excel_data: excel_data,
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
    const existingTemplate = await TEMPLATES.findOne({
      where: {
        template_id: template_id,
      },
    });

    if (!existingTemplate) {
      return res.status(404).send({ message: '존재하지 않는 템플릿 입니다.' });
    }

    res.status(200).json(existingTemplate);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: '템플릿화 실패' });
  }
});

module.exports = router;
