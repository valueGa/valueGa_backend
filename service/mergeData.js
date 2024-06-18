const fs = require('fs').promises;
const fetchFinancialData = require('./getFinance');
const fetchEvEbitdaData = require('./getEV_EBITDA');
const fetchFinancialRatios = require('./getRatio');
const fetchNetIncomeData = require('./getInfos');
const { argv } = require('process');

const mergeData = (data1, data2, data3, data4) => {
    const mergedResult = {};
    const stockCode = process.argv[2];

    const data1Entries = data1[stockCode];
    const data2Entries = data2[stockCode];
    const data3Entries = data3[stockCode];
    const data4Entries = data4[stockCode];

    data1Entries.forEach((entry) => {
        const yearMonth = entry['year'];
        mergedResult[yearMonth] = {
            rr: entry['rr'],
            dr: entry['dr'],
        };
    });

    data2Entries.forEach((entry) => {
        const yearMonth = entry['year'];
        if (!mergedResult[yearMonth]) {
            mergedResult[yearMonth] = {};
        }
        mergedResult[yearMonth]['evebitda'] = entry['evebitda'];
    });

    data3Entries.forEach((entry) => {
        const yearMonth = entry['year'];
        if (!mergedResult[yearMonth]) {
            mergedResult[yearMonth] = {};
        }
        mergedResult[yearMonth]['roe'] = entry['roe'];
        mergedResult[yearMonth]['eps'] = entry['eps'];
        mergedResult[yearMonth]['bps'] = entry['bps'];
    });

    data4Entries.forEach((entry) => {
        const yearMonth = entry['year'];
        if (!mergedResult[yearMonth]) {
            mergedResult[yearMonth] = {};
        }
        mergedResult[yearMonth]['ni'] = entry['ni'];
    });

    return mergedResult;
};

const main = async () => {
    try {
        const stockCode = process.argv[2];
        const data1 = await fetchFinancialData(stockCode);
        const data2 = await fetchEvEbitdaData(stockCode);
        const data3 = await fetchFinancialRatios(stockCode);
        const data4 = await fetchNetIncomeData(stockCode);

        const result = mergeData(data1, data2, data3, data4, stockCode);

        const dataStr = JSON.stringify(result, null, 2);

        try {
            await fs.writeFile('../data_preprocessing/src/result.json', dataStr, 'utf8');
            console.log('파일 저장 완료');
        } catch (error) {
            console.error('파일 저장 중 오류 발생', error);
        }
    } catch (error) {
        console.error('데이터를 가져오는 중 오류 발생', error);
    }
};

main();
