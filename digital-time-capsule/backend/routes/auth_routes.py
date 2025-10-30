from flask import Blueprint, request, jsonify
from models import db, User
from flask_jwt_extended import create_access_token

auth_bp = Blueprint('auth', __name__)

# ----------------- REGISTER ROUTE -----------------
@auth_bp.route('/register', methods=['POST'])
def register():
    print("Register endpoint called!")  # <-- confirms endpoint hit

    data = request.get_json()
    print("Received raw JSON data:", data)  # <-- see exactly what React sends

    if not data:
        return jsonify({"message": "No data received"}), 400

    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    print("Parsed values:", username, email, password)  # <-- debug

    # NEW: Log the exact types and values
    print(f"DEBUG: username='{username}' (Type: {type(username)})")
    print(f"DEBUG: email='{email}' (Type: {type(email)})")
    print(f"DEBUG: password='{password}' (Type: {type(password)})")

    if not username or not email or not password:
        return jsonify({"message": "Missing username, email, or password"}), 400

    # Check if the user already exists
    existing_user = User.query.filter(
        (User.email == email) | (User.username == username)
    ).first()
    print("Existing user check:", existing_user)

    if existing_user:
        return jsonify({"message": "User already exists"}), 400

    # Create a new user
    new_user = User(username=username, email=email)
    new_user.set_password(password)
    print("New user object created:", new_user)

    db.session.add(new_user)
    db.session.commit()
    print("User committed to database!")

    return jsonify({"message": "User created successfully"}), 201


# ----------------- LOGIN ROUTE -----------------
@auth_bp.route('/login', methods=['POST'])
def login():
    print("Login endpoint called!")  # <-- confirms endpoint hit

    data = request.get_json()
    print("Received raw JSON data:", data)

    if not data:
        return jsonify({"message": "No data received"}), 400

    email = data.get('email')
    password = data.get('password')
    print("Parsed values:", email, password)

    user = User.query.filter_by(email=email).first()
    print("User found in DB:", user)

    if user and user.check_password(password):
        token = create_access_token(identity=user.id)
        print("Password correct, token generated")
        return jsonify({"token": token}), 200
    else:
        print("Invalid credentials")
        return jsonify({"message": "Invalid credentials"}), 401
