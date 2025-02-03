# backend/models.py

import mysql.connector
from config import MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB

def get_connection():
    """MySQL 커넥션 획득 (취약: 커넥션 풀 미사용, 예외처리 단순)"""
    return mysql.connector.connect(
        host=MYSQL_HOST,
        user=MYSQL_USER,
        password=MYSQL_PASSWORD,
        database=MYSQL_DB
    )

def init_db():
    """DB 테이블 생성(취약: 비밀번호 해싱 안 함, 인덱스·제약조건 최소화)"""
    conn = get_connection()
    cursor = conn.cursor()

    # users 테이블 (비번 평문 저장)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) UNIQUE,
            password VARCHAR(100)
        ) ENGINE=InnoDB
    ''')

    # accounts 테이블
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS accounts (
            account_id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            balance INT DEFAULT 0,
            FOREIGN KEY (user_id) REFERENCES users(id)
        ) ENGINE=InnoDB
    ''')

    # board 테이블 (XSS 가능하도록 필터링 없이 저장)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS board (
            post_id INT AUTO_INCREMENT PRIMARY KEY,
            writer VARCHAR(50),
            content TEXT
        ) ENGINE=InnoDB
    ''')

    conn.commit()
    conn.close()

def query_db(query):
    """
    매우 단순화된 쿼리 함수.
    (취약: f-string으로 직접 연결 -> SQL 인젝션 가능)
    """
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(query)
    rows = cursor.fetchall()
    conn.commit()
    conn.close()
    return rows
