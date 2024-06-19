const express = require('express');
const router = express.Router();
const { VALUATIONS, CONSENSUSES, USERS } = require('../models');
const { Op } = require('sequelize');

// 개별 컨센서스 조회
router.get('/:stock_code', async (req, res) => {
  // #swagger.description = '개별 컨센서스 조회'
  // #swagger.tags = ['Consensuses']
  try {
    const { stock_code } = req.params;
    const { index = 0 } = req.query; // index 쿼리 파라미터 받기, 기본값은 0

    if (stock_code.length != 6) {
      return res.status(404).json({ error: '존재하지 않는 종목코드입니다.' });
    }

    //Stock_code를 기반으로 컨센서스 조회하기
    const consensusInfo = await CONSENSUSES.findOne({
      where: {
        stock_id: stock_code,
      },
    });

    if (!consensusInfo) {
      return res.status(404).json({ error: '조회하신 기업의 정보는 제공하지 않습니다.' });
    }

    //유저 개별 Valuation 목록 조회
    const valuationList = await VALUATIONS.findAll({
      where: {
        stock_id: stock_code,
      },
      include: [
        {
          model: USERS,
        },
      ],
      order: [['createdAt', 'DESC']],
      offset: parseInt(index),
      limit: 5,
    });

    const vList = {};

    const positiveCount = await VALUATIONS.count({
      where: {
        stock_id: stock_code,
        value_potential: {
          [Op.lt]: 0,
        },
      },
    });

    const negativeCount = await VALUATIONS.count({
      where: {
        stock_id: stock_code,
        value_potential: {
          [Op.lt]: 0,
        },
      },
    });

    //index 값 변경 코드 작성해주기
    let cnt = 1;
    for (const valuation of valuationList) {
      vList[`valuation${cnt}`] = {
        user_name: valuation.USER.user_name,
        past_price: valuation.current_price,
        user_target_price: valuation.target_price,
        user_past_potential: valuation.value_potential,
        valuation_date: valuation.createdAt,
      };
      cnt++;
    }

    // 평균 목표주가, 상승/하락 여력 return 가능
    return res.status(200).json({
      consensusInfo: {
        target_price: consensusInfo.target_price,
        value_potential: consensusInfo.value_potential,
      },
      valuationList: vList,
      ratio: {
        upPoten: positiveCount,
        downPoten: negativeCount,
      },
    });
  } catch (err) {
    res.status(500).json({ error: '현재 서버에 오류가 발생했습니다.' });
  }
});

module.exports = router;
