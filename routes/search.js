const express = require('express');
const { STOCKS } = require('../models');
const router = express.Router();
const { Op } = require('sequelize');

//검색 조회
router.get('/', async (req, res) => {
  // #swagger.description= '기업명 검색'
  // #swagger.tags= ['Search']

  try {
    const { searchWord } = req.query;

    let searchList = await STOCKS.findAll({
      where: {
        [Op.or]: [
          {
            stock_id: {
              [Op.startsWith]: `${searchWord}%`,
            },
          },
          {
            stock_name: {
              [Op.startsWith]: `${searchWord}%`,
            },
          },
        ],
      },
      limit: 5,
    });

    if (searchList.length < 5) {
      const additionalList = await STOCKS.findAll({
        where: {
          [Op.or]: [
            {
              stock_id: {
                [Op.like]: `%${searchWord}%`,
              },
            },
            {
              stock_name: {
                [Op.like]: `%${searchWord}%`,
              },
            },
          ],
        },
        limit: 5 - searchList.length,
      });

      searchList = [...searchList, ...additionalList];
    }

    res.status(200).json({ searchList: searchList });
  } catch (error) {
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router;
