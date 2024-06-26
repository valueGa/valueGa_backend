const axios = require('axios');
const fs = require('fs').promises;
const dotenv = require('dotenv');

dotenv.config({ path: '../.env' });

const BASE_URL = 'https://openapi.koreainvestment.com:9443';
const URL = '/uapi/domestic-stock/v1/finance/financial-ratio';
const fixedHeaders = {
    'Content-Type': 'application/json',
    authorization: process.env.HANTO_AUTHORIZATION,
    appkey: process.env.HANTO_APPKEY,
    appsecret: process.env.HANTO_SECRETKEY,
};

async function fetchFinancialRatios(stockCode) {
    try {
        const response = await axios({
            method: 'get',
            url: BASE_URL + URL,
            headers: {
                ...fixedHeaders,
                tr_id: 'FHKST66430300',
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
            [stockCode]: response.data.output.map(({ stac_yymm, roe_val, eps, bps }) => ({
                year: stac_yymm,
                roe: roe_val,
                eps: eps,
                bps: bps,
            })),
        };

        return dataToSave;
    } catch (error) {
        console.error('데이터를 가져오는 중 오류 발생', error);
    }
}

module.exports = fetchFinancialRatios;
