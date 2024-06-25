const express = require('express');
const router = express.Router();
const { TEMPLATES } = require('../models');
const { authenticateJWT } = require('./auth');
const { Op } = require('sequelize');
const DEFAULT_USER_ID = 1;

router.get('/', authenticateJWT, async (req, res) => {
  // #swagger.description = '개인 템플릿 조회'
  // #swagger.tags = ['Templates']
  const user_id = req.user.user_id;

  try {
    const template = await TEMPLATES.findAll({
      where: {
        [Op.or]: [{ user_id: user_id }, { user_id: DEFAULT_USER_ID }],
      },
      order: [['createdAt', 'DESC']], // CreatedAt 기준으로 오름차순 정렬
    });
    res.status(200).json(template);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

router.get('/my', authenticateJWT, async (req, res) => {
  // #swagger.description = '개인 템플릿 조회'
  // #swagger.tags = ['Templates']
  const user_id = req.user.user_id;

  try {
    const template = await TEMPLATES.findAll({
      where: {
        user_id: user_id,
      },
      order: [['createdAt', 'DESC']], // CreatedAt 기준으로 오름차순 정렬
    });
    res.status(200).json(template);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

router.post('/', authenticateJWT, async (req, res) => {
  //  #swagger.description = '템플릿한 내용을 저장'
  //  #swagger.tags = ['Templates']

  const { template_name, user_id, excel_data } = req.body;

  try {
    const newTemplate = await TEMPLATES.create({
      template_name: template_name,
      user_id: user_id,
      excel_data: excel_data,
    });

    res.status(200).json(newTemplate);
  } catch (error) {
    res.status(500).json({ message: '템플릿화 실패' });
  }
});

router.get('/:template_id', authenticateJWT, async (req, res) => {
  /* 
    #swagger.description = '템플릿 불러오기'
    #swagger.tags = ['Templates']
  */
  const { template_id } = req.params;

  const userId = req.user.user_id;
  //자기 템플릿이 아닌 경우에는 호출 불가능.
  console.log('유저 번호', userId);
  try {
    const existingTemplate = await TEMPLATES.findOne({
      where: {
        template_id: parseInt(template_id),
        user_id: userId || DEFAULT_USER_ID,
      },
    });

    if (!existingTemplate) {
      return res.status(404).send({ message: '존재하지 않는 템플릿 입니다.' });
    }

    res.status(200).json(existingTemplate);
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: '템플릿 호출 실패' });
  }
});

router.put('/:template_id', authenticateJWT, async (req, res) => {
  // #swagger.description = '개별 템플릿 수정'
  // #swagger.tags = ['Templates']
  const { template_id } = req.params;
  const { excel_data } = req.body;

  const user_id = req.user.user_id;

  try {
    const template = await TEMPLATES.findOne({
      where: { template_id: template_id, user_id: user_id },
    });

    if (!template_id) {
      //수정하려는 템플릿이 없는 경우
      return res.status(404).send({ error: '수정 권한이 없는 템플릿 입니다.' });
    }

    await template.update({
      excel_data: excel_data,
    });
    console.log('성공');
    res.status(200).send({ message: '정상적으로 수정되었습니다.' });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: '수저중 오류가 발생하였습니다.' });
  }
});

//토큰 인증 추가하기 모두
router.delete('/:template_id', authenticateJWT, async (req, res) => {
  /*
    #swagger.description = '템플릿 삭제하기'
    #swagger.tags = ['Templates']
  */
  const { template_id } = req.params;

  const user_id = req.user.user_id;

  try {
    const template = await TEMPLATES.findOne({
      where: { template_id: template_id, user_id: user_id },
    });

    if (!template_id) {
      return res.status(400).send({ message: '템플릿을 찾을 수 없음' });
    }

    await template.destroy();

    res.status(200).send({ message: '템플릿 삭제 완료' });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: '삭제 중 에러가 발생하였습니다.' });
  }
});

module.exports = router;
