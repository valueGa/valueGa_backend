import requests
import os
import pandas as pd
from dotenv import load_dotenv

load_dotenv()

def get_sales_revenue(corp_code, bsns_year, reprt_code):
    url = "https://opendart.fss.or.kr/api/fnlttSinglAcnt.json"
    params = {
        "crtfc_key": os.getenv("DART_KEY"),
        "corp_code": corp_code,
        "bsns_year": bsns_year,
        "reprt_code": reprt_code
    }

    response = requests.get(url, params=params)

    print(f"Status Code: {response.status_code}")

    try:
        sales_data = response.json()
        return sales_data
    except ValueError:
        print(response.text)
        return None


def extract_sales_data(corp_code, bsns_year, reprt_code):
    data = get_sales_revenue(corp_code, bsns_year[:4],reprt_code)

    # list 부분 추출
    data_list = data['list']

    # 데이터프레임으로 변환
    df = pd.DataFrame(data_list)

    # 필터링할 값 목록
    filter_values = ['매출액','영업이익','법인세차감전 순이익']

    filtered_df = df[["fs_nm", "account_nm","thstrm_amount" ,"frmtrm_amount" , "bfefrmtrm_amount"]]

    financial_statements = '연결제무제표'
    fs_type = "CFS"

    num_rows_with_consolidated = len(filtered_df[filtered_df['fs_nm'].str.contains(financial_statements)])
    if(num_rows_with_consolidated == 0):
        financial_statements='재무제표'
        fs_type = "OFS"

    # 필터링 수행
    output_df = filtered_df[(filtered_df['account_nm'].isin(filter_values)) & (filtered_df['fs_nm'] == financial_statements)]
    filtered_df = output_df[[ "account_nm","thstrm_amount" ,"frmtrm_amount" , "bfefrmtrm_amount"]]

    output_df = filtered_df[(filtered_df['account_nm'].isin(filter_values))]


    missing_values = set(filter_values) - set(output_df['account_nm'])
    if missing_values:
        missing_df = pd.DataFrame({
            'account_nm': list(missing_values),
            'thstrm_amount': [0] * len(missing_values),
            'frmtrm_amount': [0] * len(missing_values),
            'bfefrmtrm_amount': [0] * len(missing_values)
        })
        output_df = pd.concat([output_df, missing_df], ignore_index=True)

    output_df = output_df.sort_values(by='account_nm')


    #값에 쉼표 제거
    output_df['thstrm_amount'] = pd.to_numeric(output_df['thstrm_amount'].str.replace(',', ''))
    output_df['frmtrm_amount'] = pd.to_numeric(output_df['frmtrm_amount'].str.replace(',', ''))
    output_df['bfefrmtrm_amount'] = pd.to_numeric(output_df['bfefrmtrm_amount'].str.replace(',', ''))

    y1 = int(bsns_year)
    y2 =  y1 - 100
    y3 =  y2 - 100

    output_df = output_df.rename(columns={
        'account_nm': '',
        'thstrm_amount': bsns_year,
        'frmtrm_amount': str(y2),
        'bfefrmtrm_amount': str(y3)
    })

    result = output_df.set_index('').transpose()

    result["시간"] = result.index

    return (result, fs_type)
