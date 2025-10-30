from flask import Flask
from flask_cors import CORS
from models import db, bcrypt
from routes.auth_routes import auth_bp
from flask_jwt_extended import JWTManager
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# ------------------------------------------------------------------
# 1. APPLICATION CONFIGURATION (MUST BE AT THE TOP)
# ------------------------------------------------------------------
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')

# ------------------------------------------------------------------
# 2. INITIALIZE EXTENSIONS
# ------------------------------------------------------------------
db.init_app(app)
bcrypt.init_app(app)
jwt = JWTManager(app)

# ------------------------------------------------------------------
# 3. CORS FIX: Use ONLY the correct, specific configuration
# ------------------------------------------------------------------
# This is the line that allows your Vite frontend to talk to your Flask backend
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

# ------------------------------------------------------------------
# 4. REGISTER BLUEPRINTS (MUST BE BEFORE RUNNING THE APP)
# ------------------------------------------------------------------
app.register_blueprint(auth_bp)

# The 'home' route is fine
@app.route('/')
def home():
    return "Welcome to Capsula!"

# Remove the duplicated @app.route('/register', methods=['POST'])
# if it is already defined inside your auth_bp blueprint.

# ------------------------------------------------------------------
# 5. RUN THE APP
# ------------------------------------------------------------------
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    # Add debug=True for better error reporting in development
    app.run(port=5000, debug=True)