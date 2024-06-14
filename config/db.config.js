const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '.env') });

module.exports = {
  HOST: process.env.HOST_DOMAIN,
  USER: process.env.USER_NAME,
  // password에는 설치할때 설정한 비밀번호 입력!
  PASSWORD: process.env.USER_PASSWORD,
  DB: process.env.DB_NAME,
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
