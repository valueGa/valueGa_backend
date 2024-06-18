import pandas as pd
import json
import sys
from dart_sales_infos_parser import *
from dart_stock_infos_parser import *
from dart_finanical_data_parser import *

#input_infos = ["00126380", "2023", "11011","CFS"]
input_infos = sys.argv[1:]
input_infos.append("11011")


# JSON 파일 읽기
with open('src/result.json', 'r', encoding='utf-8') as file:
    data = json.load(file)

# 데이터 프레임으로 변환
df = pd.DataFrame.from_dict(data, orient='index')

try:
    # 202312기준 (최근 3년)
    export_table = df.loc[['202312', '202212', '202112']]
    year_info = '202312'
except KeyError:
    # 해당 행이 없는 경우
    print("YYYY12 형태의 지정된 행이 DataFrame에 존재하지 않습니다.")

try:
    # 202403기준 (최근 3년)
    export_table = df.loc[['202403', '202303', '202203']]
    year_info ='202403'
except KeyError:
    print("YYYY03 형태의 지정된 행이 DataFrame에 존재하지 않습니다.")

#필수 인자를 전달 받지 못한 경우
if(len(input_infos) != 3 ):
    print("Error: Incorrect number of input arguments. Please provide 4 arguments.")
    sys.exit(1)

data1,fs_type = extract_sales_data(input_infos[0], year_info, input_infos[2])
data2 = extract_financial_data(input_infos[0], year_info, input_infos[2],fs_type)
data3 = extract_stock_total_quantity(input_infos[0], year_info, input_infos[2],fs_type)

### node.js에서 추출한 json  데이터까지 통합하기

merge_table = pd.concat([data2,data1,export_table], axis=1)
stock_amount = data3["총유통주식"][0]
stock_amount = int(stock_amount.replace(",",""))

merge_table['fpl'] = merge_table.apply(lambda row: pd.to_numeric(row['금융수익']) - pd.to_numeric(row['금융비용']), axis=1)
merge_table['epl'] = merge_table.apply(lambda row: pd.to_numeric(row['기타이익']) - pd.to_numeric(row['기타손실']), axis=1)
merge_table['ts'] = stock_amount
merge_table['stock_id'] = input_infos[1] #종목코드 입력 받아야 함

final_table = merge_table.rename(columns={
    '기타이익': 'ep',
    '기타손실': 'el',
    '판매비와관리비': 'se',
    '금융비용': 'fl',
    '금융수익': 'fp',
    '법인세비용(수익)' : 'ite',
    '매출액' : 'sr',
    '영업이익' : 'oi',
    '법인세차감전 순이익' : 'ibt',
    '시간' : 'year',
})

final_table.to_csv('src/output.csv', index=False, encoding='utf-8-sig')