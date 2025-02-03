# backend/routes/board_routes.py

from flask import Blueprint, request, jsonify, session
from models import query_db

board_bp = Blueprint('board', __name__)

@board_bp.route('', methods=['GET'])
def get_posts():
    rows = query_db("SELECT post_id, writer, content FROM board")
    posts = []
    for row in rows:
        posts.append({
            'post_id': row[0],
            'writer': row[1],
            'content': row[2]  # 필터링 없음 -> XSS 가능
        })
    return jsonify(posts)

@board_bp.route('', methods=['POST'])
def create_post():
    if 'user_id' not in session:
        return jsonify({'message': '인증 안 됨'}), 401

    data = request.json
    writer = data.get('writer')
    content = data.get('content')

    # 취약: HTML 태그 / 스크립트 필터링 없음
    query = f"INSERT INTO board (writer, content) VALUES ('{writer}', '{content}')"
    query_db(query)
    return jsonify({'message': '게시물 등록 완료'})
