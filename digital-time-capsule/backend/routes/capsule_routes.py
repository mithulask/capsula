from flask import Blueprint, request, jsonify
from models import db, Capsule, User
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

capsule_bp = Blueprint("capsule", __name__)

# Create a new capsule
@capsule_bp.route("/capsules", methods=["POST"])
@jwt_required()
def create_capsule():
    data = request.get_json()
    user_id = get_jwt_identity()  # get current logged-in user
    title = data.get("title")
    content = data.get("content")
    media_url = data.get("media_url")
    unlock_date_str = data.get("unlock_date")  # expect "YYYY-MM-DD" string
    unlock_date = datetime.strptime(unlock_date_str, "%Y-%m-%d")

    new_capsule = Capsule(
        title=title,
        content=content,
        media_url=media_url,
        unlock_date=unlock_date,
        owner_id=user_id
    )
    db.session.add(new_capsule)
    db.session.commit()

    return jsonify({"message": "Capsule created!"}), 201


# Get unlocked capsules for the logged-in user
@capsule_bp.route("/capsules", methods=["GET"])
@jwt_required()
def get_capsules():
    user_id = get_jwt_identity()
    now = datetime.utcnow()

    capsules = Capsule.query.filter_by(owner_id=user_id).all()
    result = []
    for c in capsules:
        is_unlocked = now >= c.unlock_date
        result.append({
            "id": c.id,
            "title": c.title,
            "content": c.content if is_unlocked else None,
            "media_url": c.media_url if is_unlocked else None,
            "unlock_date": c.unlock_date.isoformat(),
            "is_unlocked": is_unlocked
        })

    return jsonify(result)
