# backend/routes/account_routes.py

from flask import Blueprint, request, jsonify, session
from models import query_db

account_bp = Blueprint('account', __name__)

@account_bp.route('/create_account', methods=['POST'])
def create_account():
    if 'user_id' not in session:
        return jsonify({'message': '인증 안 됨'}), 401

    user_id = session['user_id']
    query = f"INSERT INTO accounts (user_id, balance) VALUES ({user_id}, 0)"
    query_db(query)
    return jsonify({'message': '계좌 개설 완료'})

@account_bp.route('/accounts', methods=['GET'])
def get_accounts():
    if 'user_id' not in session:
        return jsonify({'message': '인증 안 됨'}), 401

    user_id = session['user_id']
    query = f"SELECT account_id, balance FROM accounts WHERE user_id={user_id}"
    rows = query_db(query)
    accounts = [{'account_id': row[0], 'balance': row[1]} for row in rows]
    return jsonify(accounts)

@account_bp.route('/transfer', methods=['POST'])
def transfer():
    """이체 (취약: CSRF 방어 없음, 문자열 결합 등)"""
    if 'user_id' not in session:
        return jsonify({'message': '인증 안 됨'}), 401

    data = request.json
    from_account_id = data.get('fromAccountId')
    to_account_id = data.get('toAccountId')
    amount = int(data.get('amount', 0))

    # 출금 계좌 잔액 확인
    query_balance = f"SELECT balance FROM accounts WHERE account_id={from_account_id}"
    result = query_db(query_balance)
    if not result:
        return jsonify({'message': '출금 계좌 없음'}), 400

    from_balance = result[0][0]
    if from_balance < amount:
        return jsonify({'message': '잔액 부족'}), 400

    # 출금
    new_from = from_balance - amount
    query_db(f"UPDATE accounts SET balance={new_from} WHERE account_id={from_account_id}")

    # 입금 계좌 확인
    query_balance_to = f"SELECT balance FROM accounts WHERE account_id={to_account_id}"
    result_to = query_db(query_balance_to)
    if not result_to:
        return jsonify({'message': '입금 계좌 없음'}), 400

    to_balance = result_to[0][0] + amount
    query_db(f"UPDATE accounts SET balance={to_balance} WHERE account_id={to_account_id}")

    return jsonify({'message': '이체 성공'})
