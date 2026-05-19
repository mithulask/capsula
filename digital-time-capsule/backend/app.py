from flask_cors import CORS
from flask import Flask
from flask_jwt_extended import JWTManager
from models import db, bcrypt
from routes.auth_routes import auth_bp
from routes.capsule_routes import capsule_bp
import os

def create_app():
    app = Flask(__name__)

    # ---------- CONFIG ----------
    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get(
        "DATABASE_URL", "sqlite:///capsula.db"
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = os.environ.get(
        "JWT_SECRET_KEY", "super-secret-key"
    )

    # ---------- INIT EXTENSIONS ----------
    db.init_app(app)
    bcrypt.init_app(app)
    JWTManager(app)
    CORS(app)  # allow all cross-origin requests for dev

    # ---------- REGISTER BLUEPRINTS ----------
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(capsule_bp)

    # ---------- SIMPLE ROOT ROUTE ----------
    @app.route("/")
    def index():
        return {"message": "Welcome to Capsula API!"}

    return app


if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5000)