import requests
import os
import pandas as pd
from dotenv import load_dotenv

load_dotenv()

def get_stock_total_quantity(corp_code, bsns_year, reprt_code, fs_div):

    url = "https://opendart.fss.or.kr/api/stockTotqySttus.json"
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
        stock_data = response.json()
        return stock_data
    except ValueError:
        print(response.text)
        return None


def extract_stock_total_quantity(corp_code, bsns_year, reprt_code, fs_div):
    data = get_stock_total_quantity(corp_code, bsns_year[:4], reprt_code, fs_div)

    data_list = data['list']

    df = pd.DataFrame(data_list)


    filtered_stock_df = df[df['se'].str.contains('보통주')]

    filtered_stock_df = filtered_stock_df[['istc_totqy']]

    result = filtered_stock_df.rename(columns={
    'istc_totqy' : '총유통주식'
    })


    return result

