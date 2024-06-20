const axios = require('axios');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config({ path: '../.env' });

const BASE_URL = 'https://openapi.koreainvestment.com:9443';
const URL = '/oauth2/tokenP';

async function getAccessToken() {
  try {
    const response = await axios({
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
    });

    const token = response.data.access_token;
    const bearer = 'Bearer ';
    const accessToken = bearer + token;

    fs.writeFileSync('token.dat', accessToken);

    return accessToken;
  } catch (error) {
    console.error('Access token 갱신 중 오류 발생:', error);
    throw error;
  }
}

exports.getAccessToken = getAccessToken;
