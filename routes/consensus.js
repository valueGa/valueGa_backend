const express = require('express');
const router = express.Router();
const { VALUATIONS, CONSENSUSES, USERS, STOCKS, FINANCE_INFOS } = require('../models');
const { Op } = require('sequelize');
const { fetchCurrentStockPrice } = require('../service/getCurrentStockPrice');
const { fetchDailyChartInfo } = require('../service/getDailyChart');
const { getAccessToken } = require('../service/getAccessToken');

// 개별 컨센서스 조회
router.get('/:stock_code', async (req, res) => {
  // #swagger.description = '개별 컨센서스 조회'
  // #swagger.tags = ['Consensuses']
  console.log('요청 왔음');
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

    const vList = [];

    const positiveCount = await VALUATIONS.count({
      where: {
        stock_id: stock_code,
        value_potential: {
          [Op.lt]: parseInt(0),
        },
      },
    });

    const negativeCount = await VALUATIONS.count({
      where: {
        stock_id: stock_code,
        value_potential: {
          [Op.lt]: parseInt(0),
        },
      },
    });

    //index 값 변경 코드 작성해주기
    let cnt = 0;
    for (const valuation of valuationList) {
      vList[cnt] = {
        user_name: valuation.USER.user_name,
        past_price: valuation.current_price,
        user_target_price: valuation.target_price,
        user_past_potential: valuation.value_potential,
        valuation_date: valuation.createdAt,
      };
      cnt++;
    }

    async function fetchData(stock_code, retryCount = 0) {
      try {
        const currentPrice = await fetchCurrentStockPrice(stock_code);
        const chartInfo = await fetchDailyChartInfo(stock_code);
        return { currentPrice, chartInfo };
      } catch (err) {
        if (err.response && err.response.data && err.response.data.msg_cd === 'EGW00121') {
          // token 토큰 만료로 인한 오류인 경우 갱신하고 재실행
          if (retryCount < 1) {
            await getAccessToken();
            return await fetchData(stock_code, retryCount + 1);
          } else {
            throw err;
          }
        } else {
          throw err;
        }
      }
    }

    const result = await fetchData(stock_code);

    // FINANCE_INFOS 테이블에서 가져오기
    const financeInfos = await FINANCE_INFOS.findOne({
      where: {
        stock_id: stock_code,
      },
      order: [['year', 'DESC']],
    });

    return res.status(200).json({
      currentPrice: result['currentPrice'],
      consensusInfo: {
        target_price: consensusInfo.target_price,
        value_potential: consensusInfo.value_potential,
      },
      valuationList: vList,
      ratio: {
        upPoten: positiveCount,
        downPoten: negativeCount,
      },
      financeInfos: {
        year: financeInfos.year,
        oi: financeInfos.oi,
        rr: financeInfos.rr,
        dr: financeInfos.dr,
        ts: financeInfos.ts,
        sr: financeInfos.sr,
        bps: financeInfos.bps,
        roe: financeInfos.roe,
        evebitda: financeInfos.evebitda,
      },
      chartInfo: result['chartInfo'][stock_code],
    });
  } catch (err) {
    res.status(500).json({ error: '현재 서버에 오류가 발생했습니다.' });
  }
});

//종합 컨센서스 조회
router.get('/', async (req, res) => {
  // #swagger.description = '종합 컨센서스 조회'
  // #swagger.tags = ['Consensuses']

  // 현재가 받아오기
  async function fetchStockPrice(stock_code, retryCount = 0) {
    try {
      const currentPrice = await fetchCurrentStockPrice(stock_code);
      return currentPrice;
    } catch (err) {
      if (
        err.response &&
        err.response.data &&
        (err.response.data.msg_cd === 'EGW00121' || err.response.data.msg_cd === 'EGW00123')
      ) {
        // token 토큰 만료로 인한 오류인 경우 갱신하고 재실행
        if (retryCount < 1) {
          console.log('재발급 요청');
          await getAccessToken();
          return await fetchStockPrice(stock_code, retryCount + 1);
        } else {
          throw err;
        }
      } else {
        throw err;
      }
    }
  }

  try {
    const { index = 0 } = req.query;

    const overvaluedList = await CONSENSUSES.findAll({
      where: {
        value_potential: { [Op.not]: null },
      },
      order: [['value_potential', 'DESC']],
      offset: parseInt(index),
      limit: 5,
    });

    overTop5 = {};
    let cnt = 1;

    for (const overInfo of overvaluedList) {
      const stockInfo = await STOCKS.findOne({
        where: {
          stock_id: overInfo.stock_id,
        },
      });
      const currentPrice = await fetchStockPrice(overInfo.stock_id);

      overTop5[`top${cnt}`] = {
        company_name: stockInfo.stock_name,
        stock_code: overInfo.stock_id,
        value_potential: overInfo.value_potential,
        target_price: overInfo.target_price,
        currentPrice: currentPrice,
      };
      cnt++;
    }

    underTop5 = {};
    cnt = 1;

    const undervaluedList = await CONSENSUSES.findAll({
      where: {
        value_potential: { [Op.not]: null },
      },
      order: [['value_potential', 'ASC']],
      offset: parseInt(index),
      limit: 5,
    });

    for (const underInfo of undervaluedList) {
      const stockInfo = await STOCKS.findOne({
        where: {
          stock_id: underInfo.stock_id,
        },
      });

      const currentPrice = await fetchStockPrice(underInfo.stock_id);

      underTop5[`top${cnt}`] = {
        company_name: stockInfo.stock_name,
        stock_code: underInfo.stock_id,
        value_potential: underInfo.value_potential,
        target_price: underInfo.target_price,
        currentPrice: currentPrice,
      };
      cnt++;
    }

    //Buy 예측 개수와 Sell 개수
    const buyCount = await CONSENSUSES.count({
      where: {
        value_potential: { [Op.not]: null },
        value_potential: {
          [Op.lt]: 0,
        },
      },
    });

    const sellCount = await CONSENSUSES.count({
      where: {
        value_potential: { [Op.not]: null },
        value_potential: {
          [Op.gt]: 0,
        },
      },
    });

    return res.status(201).json({
      overvaluedList: overTop5,
      undervaluedList: underTop5,
      totalList: {
        buyCount: buyCount,
        sellCount: sellCount,
      },
    });
  } catch (err) {
    console.log(err);
  }
});
module.exports = router;
