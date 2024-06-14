const axios = require('axios');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config({ path: '../.env' });

const BASE_URL = 'https://openapi.koreainvestment.com:9443';
const URL = '/oauth2/tokenP';

axios({
    method: 'post',
    url: BASE_URL + URL,
    data: {
        grant_type: 'client_credentials',
        appkey: process.env.HANTO_APPKEY,
        appsecret: process.env.HANTO_SECRETKEY,
    },
    headers: {
        'Content-Type': 'application/json',
    },
    params: {},
    responseType: 'json',
}).then((response) => {
    console.log(response.data);
});
