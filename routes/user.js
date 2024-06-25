const express = require('express');
const router = express.Router();
const { USERS } = require('../models');
const { authenticateJWT } = require('./auth');

router.get('/:user_id', authenticateJWT, async (req, res) => {
  /*
        #swagger.description = 'user 정보 불러오기'
        #swagger.tags = ['My page']
     */
  const { user_id } = req.params;

  try {
    const user = await USERS.findOne({
      where: { user_id: parseInt(user_id, 10) },
    });

    if (!user) {
      return res.status(404).send({ message: '사용자를 찾을 수 없습니다.' });
    }

    res.status(200).send({
      user_id: user.user_id,
      user_name: user.user_name,
      user_email: user.user_email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: '사용자 정보를 가져오는 중 에러 발생' });
  }
});

module.exports = router;
