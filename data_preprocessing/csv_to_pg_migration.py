import pandas as pd
import psycopg2
import sys
import os
from dotenv import load_dotenv

load_dotenv()

# CSV 파일 읽기
df = pd.read_csv('src/output.csv')

# 'year' 열의 값을 'YYYY-mm-31' 형식으로 변환
df['year'] = pd.to_datetime(df['year'].astype(str), format='%Y%m').dt.strftime('%Y-%m-31')

print(df['year'])

# money 타입 열들을 문자열로 변환 (PostgreSQL의 money 타입과 호환되도록)
money_columns = ['ep', 'el', 'se', 'fl', 'fp', 'ite', 'sr', 'oi', 'ibt', 'fpl', 'epl']
for col in money_columns:
    df[col] = df[col].apply(lambda x: f"{x:.2f}")

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

    # 연결 성공 확인을 위한 간단한 쿼리 실행
    cur.execute('SELECT version();')
    db_version = cur.fetchone()
    print(f"PostgreSQL 데이터베이스에 성공적으로 연결되었습니다: {db_version[0]}")

    ################## DB 연결 성공 ######################
    create_table_query = '''
    CREATE TABLE IF NOT EXISTS FINANCE_INFOS (
        ep money,
        el money,
        se money,
        fl money,
        fp money,
        ite money,
        sr money,
        oi money,
        ibt money,
        year date,
        rr float,
        dr float,
        evebitda float,
        roe float,
        bps float,
        ni float,
        fpl money,
        epl money,
        ts BIGINT,
        stock_id CHAR(6) NOT NULL
    )'''

    cur.execute(create_table_query)
    conn.commit()
    print('테이블 생성 완료')

    # 데이터 삽입
    for index, row in df.iterrows():
        insert_query = '''
        INSERT INTO FINANCE_INFOS (fl,fp,el, ep, ite, se, sr, ibt, oi, year, rr, dr, evebitda, roe, bps, ni, fpl, epl, ts, stock_id)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        '''
        cur.execute(insert_query, (
            row['ep'], row['el'], row['se'], row['fl'], row['fp'], row['ite'], row['sr'], row['oi'], row['ibt'],
            row['year'], row['rr'], row['dr'], row['evebitda'], row['roe'], row['bps'], row['ni'],
            row['fpl'], row['epl'], row['ts'], str(row['stock_id']).zfill(6)
        ))

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
