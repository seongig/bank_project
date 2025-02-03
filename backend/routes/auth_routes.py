# backend/routes/auth_routes.py

from flask import Blueprint, request, jsonify, session, make_response
from models import query_db

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')  # 취약: 평문 저장

    # SQL 인젝션 가능
    query = f"INSERT INTO users (username, password) VALUES ('{username}', '{password}')"
    try:
        query_db(query)
    except Exception as e:
        return jsonify({'message': '회원가입 실패(중복 or 인젝션)', 'error': str(e)}), 400

    return jsonify({'message': '회원가입 성공'})

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    # 취약: f-string 결합 -> SQL 인젝션 가능
    query = f"SELECT id FROM users WHERE username='{username}' AND password='{password}'"
    result = query_db(query)

    if len(result) > 0:
        user_id = result[0][0]
        session['user_id'] = user_id  # Flask 세션
        resp = make_response(jsonify({'message': '로그인 성공', 'user_id': user_id}))
        # 세션 쿠키 설정 (보안 옵션 없음)
        resp.set_cookie('session', str(user_id))
        return resp
    else:
        return jsonify({'message': '로그인 실패'}), 401

@auth_bp.route('/logout', methods=['POST'])
def logout():
    session.clear()
    resp = make_response(jsonify({'message': '로그아웃 완료'}))
    resp.set_cookie('session', '', expires=0)
    return resp

@auth_bp.route('/checkauth', methods=['GET'])
def check_auth():
    """로그인 여부 확인(취약)"""
    if 'user_id' in session:
        return jsonify({'authenticated': True, 'user_id': session['user_id']})
    else:
        return jsonify({'authenticated': False})
