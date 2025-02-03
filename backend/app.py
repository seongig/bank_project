# backend/app.py

from flask import Flask
from flask_cors import CORS
from config import SECRET_KEY
from models import init_db
from routes.auth_routes import auth_bp
from routes.account_routes import account_bp
from routes.board_routes import board_bp

def create_app():
    app = Flask(__name__)
    app.secret_key = SECRET_KEY

    # CORS 허용 (credentials=True로 쿠키 전송 허용)
    CORS(app, supports_credentials=True)

    # DB 초기화
    init_db()

    # 블루프린트 등록
    # /api/auth/... , /api/account/... , /api/board/...
    app.register_blueprint(auth_bp, url_prefix='/api')
    app.register_blueprint(account_bp, url_prefix='/api')
    app.register_blueprint(board_bp, url_prefix='/api/board')

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
