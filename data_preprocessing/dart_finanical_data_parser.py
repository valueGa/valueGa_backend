import requests
import os
import pandas as pd
from dotenv import load_dotenv

load_dotenv()


def get_financial_statements(corp_code, bsns_year, reprt_code, fs_div):
    url = "https://opendart.fss.or.kr/api/fnlttSinglAcntAll.json"
    params = {
        "crtfc_key": os.getenv("DART_KEY"),
        "corp_code": corp_code,
        "bsns_year": bsns_year,
        "reprt_code": reprt_code,
        "fs_div": fs_div
    }

    response = requests.get(url, params=params)
    print(f"Status Code: {response.status_code}")

    try:
        data = response.json()
        return data
    except ValueError:
        print(response.text)
        return None


def extract_financial_data(company_code, year, report_type, statement_type):
    infos = [company_code, year, report_type, statement_type]
    data = get_financial_statements(infos[0], infos[1][:4], infos[2], infos[3])
    data_list = data['list']

    # 데이터프레임으로 변환
    df = pd.DataFrame(data_list)

    # 필요한 열만 선택
    filtered_df = df[["account_nm", "thstrm_amount", "frmtrm_amount", "bfefrmtrm_amount"]]

    # 필터링할 값 목록
    filter_values = ['기타이익', '기타손실', '금융수익', '금융비용', '법인세비용(수익)','판매비와관리비']

    # 필터링 수행
    output_df = filtered_df[filtered_df['account_nm'].isin(filter_values)]

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

    y1 = int(year)
    y2 =  y1 - 100
    y3 =  y2 - 100

    # 열 이름 변경
    new_df = output_df.rename(columns={
        'account_nm': '',
        'thstrm_amount': str(y1),
        'frmtrm_amount': str(y2),
        'bfefrmtrm_amount': str(y3)
    })

    result = new_df.set_index('').transpose()

    return result

# 데이터 추출을 위한 종목코드를 인자 전달
# 1번인자 :DART에서 필요한 기업코드 번호
# 2번인자 : 년도 2023 입력시 23년 포함 아래로 3개년 추출 (2015 이후 데이터만 있음)