import sys
import pandas as pd
import psycopg2
import os
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

df = pd.read_csv('stocks.csv')

db_config = {
    'dbname': os.getenv("DB_NAME"),
    'user': os.getenv("DB_USER"),
    'password': os.getenv("DB_PASSWORD"),
    'host': os.getenv("DB_HOST"),
    'port': os.getenv("DB_PORT"),
}

try:
    # PostgreSQL 데이터베이스 연결
    conn = psycopg2.connect(**db_config)
    cur = conn.cursor()

    cur.execute('SELECT version();')
    db_version = cur.fetchone()
    print(f"PostgreSQL 데이터베이스에 성공적으로 연결되었습니다: {db_version[0]}")

    ################## DB 연결 성공 ######################
    # create_table_query = '''
    # CREATE TABLE IF NOT EXISTS "CONSENSUSES" (
    #     stock_name VARCHAR(255),
    #     stock_id CHAR(6) PRIMARY KEY
    # )
    # '''
    #
    # cur.execute(create_table_query)
    # conn.commit()
    # print('테이블 생성 완료')
    print('실행완료')
    cnt = 1;

    for index, row in df.iterrows():
        insert_query = '''
        INSERT INTO "CONSENSUSES" (stock_id,target_price,value_potential,excel_data,"createdAt","updatedAt") VALUES (%s,%s,%s,%s,%s,%s)
        '''
        print(cnt);
        cnt +=1;
        cur.execute(insert_query, (str(row['stock_id']).zfill(6),0,0,None, datetime.now(), datetime.now()))

    conn.commit()
    print('데이터 삽입 완료')

except Exception as e:
    print(f"PostgreSQL 데이터베이스 연결에 실패했습니다: {e}")
    sys.exit(1)

finally:
    if cur:
        cur.close()
    if conn:
        conn.close()
