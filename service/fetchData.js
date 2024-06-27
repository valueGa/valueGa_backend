const { getAccessToken } = require('./getAccessToken');
const { fetchCurrentStockPrice } = require('./getCurrentStockPrice');
const { fetchDailyChartInfo } = require('./getDailyChart');

//현재가 가져오기
async function fetchStockPrice(stock_code, retryCount = 0) {
  try {
    const currentPrice = await fetchCurrentStockPrice(stock_code);
    return currentPrice;
  } catch (err) {
    // token 토큰 만료로 인한 오류인 경우 갱신하고 재실행
    if (retryCount < 1) {
      await getAccessToken();
      return await fetchStockPrice(stock_code, retryCount + 1);
    } else {
      throw err;
    }
  }
}

//현재가 + 차트 데이터 가져오기
async function fetchChartNPrice(stock_code, retryCount = 0) {
  try {
    const currentPrice = await fetchCurrentStockPrice(stock_code);
    const chartInfo = await fetchDailyChartInfo(stock_code);
    return { currentPrice, chartInfo };
  } catch (err) {
    // token 토큰 만료로 인한 오류인 경우 갱신하고 재실행
    if (retryCount < 1) {
      await getAccessToken();
      return await fetchChartNPrice(stock_code, retryCount + 1);
    } else {
      throw err;
    }
  }
}

exports.fetchStockPrice = fetchStockPrice;
exports.fetchChartNPrice = fetchChartNPrice;
