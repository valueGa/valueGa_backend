const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });
const fs = require('fs');

const BASE_URL = 'https://openapi.koreainvestment.com:9443';
const URL = '/uapi/domestic-stock/v1/quotations/inquire-ccnl';

async function fetchCurrentStockPrice(stockCode) {
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
        tr_id: 'FHKST01010100',
      },
      params: {
        FID_COND_MRKT_DIV_CODE: 'J',
        FID_INPUT_ISCD: stockCode,
      },
      responseType: 'json',
    });

    return response.data.output['stck_prpr'];
  } catch (error) {
    //console.error('데이터를 가져오는 중 오류 발생', error);
    throw error;
  }
}

exports.fetchCurrentStockPrice = fetchCurrentStockPrice;
