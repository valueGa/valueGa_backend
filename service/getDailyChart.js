const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });
const fs = require('fs');

const BASE_URL = 'https://openapi.koreainvestment.com:9443';
const URL = '/uapi/domestic-stock/v1/quotations/inquire-daily-price';

async function fetchDailyChartInfo(stockCode) {
  try {
    const token = fs.readFileSync('token.dat', 'utf8').trim();

    const fixedHeaders = {
      'Content-Type': 'application/json',
      authorization: token,
      appkey: process.env.HANTO_APPKEY,
      appsecret: process.env.HANTO_SECRETKEY,
    };

    const response = await axios({
      method: 'get',
      url: BASE_URL + URL,
      headers: {
        ...fixedHeaders,
        tr_id: 'FHKST01010400',
      },
      params: {
        FID_COND_MRKT_DIV_CODE: 'J',
        FID_INPUT_ISCD: stockCode,
        FID_PERIOD_DIV_CODE: 'D',
        FID_ORG_ADJ_PRC: '0',
      },
      responseType: 'json',
    });

    const result = {
      [stockCode]: response.data.output.map(({ stck_clpr, stck_bsop_date }) => ({
        closePrice: stck_clpr,
        date: stck_bsop_date,
      })),
    };

    return result;
  } catch (error) {
    console.error('데이터를 가져오는 중 오류 발생', error);
  }
}

exports.fetchDailyChartInfo = fetchDailyChartInfo;
