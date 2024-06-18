const axios = require('axios');
const fs = require('fs').promises;
const dotenv = require('dotenv');

dotenv.config({ path: '../.env' });

const BASE_URL = 'https://openapi.koreainvestment.com:9443';
const URL = '/uapi/domestic-stock/v1/finance/income-statement';
const fixedHeaders = {
    'Content-Type': 'application/json',
    authorization: process.env.HANTO_AUTHORIZATION,
    appkey: process.env.HANTO_APPKEY,
    appsecret: process.env.HANTO_SECRETKEY,
};

async function fetchEvEbitdaData(stockCode) {
    try {
        const response = await axios({
            method: 'get',
            url: BASE_URL + URL,
            headers: {
                ...fixedHeaders,
                tr_id: 'FHKST66430500',
                custtype: 'P',
            },
            params: {
                FID_DIV_CLS_CODE: '0',
                fid_cond_mrkt_div_code: 'J',
                fid_input_iscd: stockCode,
            },
            responseType: 'json',
        });

        const dataToSave = {
            [stockCode]: response.data.output.map(({ stac_yymm, ev_ebitda }) => ({
                year: stac_yymm,
                evebitda: ev_ebitda,
            })),
        };

        return dataToSave;
    } catch (error) {
        console.error('데이터를 가져오는 중 오류 발생', error);
    }
}

module.exports = fetchEvEbitdaData;
