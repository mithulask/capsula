# capsule_routes.py
from flask import Blueprint, request, jsonify, current_app, send_from_directory
from models import db, Capsule, CapsuleMember, User
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from math import radians, sin, cos, sqrt, atan2
import os, base64, uuid

capsule_bp = Blueprint("capsule", __name__)

UPLOAD_ROOT = os.path.join(os.getcwd(), "static", "uploads")
os.makedirs(UPLOAD_ROOT, exist_ok=True)

def distance_m(lat1, lon1, lat2, lon2):
    """Haversine distance in meters."""
    R = 6371000.0
    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)
    a = sin(dlat / 2) ** 2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon / 2) ** 2
    return R * 2 * atan2(sqrt(a), sqrt(1 - a))

def _capsule_images_urls(capsule_id):
    """Return list of image urls (relative) saved under static/uploads/<capsule_id>/"""
    folder = os.path.join(UPLOAD_ROOT, str(capsule_id))
    if not os.path.isdir(folder):
        return []
    files = sorted(os.listdir(folder))
    return [f"/static/uploads/{capsule_id}/{fname}" for fname in files]

# ---------------- CREATE CAPSULE ----------------
@capsule_bp.route("/capsules", methods=["POST"])
@jwt_required()
def create_capsule():
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}

    title = (data.get("title") or "").strip()
    unlock_date_str = (data.get("unlock_date") or "").strip()

    if not title or not unlock_date_str:
        return jsonify({"error": "title and unlock_date are required"}), 400

    # parse unlock date — accept "YYYY-MM-DD" or ISO (handle trailing Z)
    try:
        if len(unlock_date_str) == 10:
            unlock_date = datetime.strptime(unlock_date_str, "%Y-%m-%d")
        else:
            # support trailing Z by converting to +00:00
            s = unlock_date_str
            if s.endswith("Z"):
                s = s.replace("Z", "+00:00")
            unlock_date = datetime.fromisoformat(s)
    except Exception:
        return jsonify({"error": "invalid unlock_date — use YYYY-MM-DD or ISO format"}), 400

    # optional location fields
    latitude = data.get("latitude")
    longitude = data.get("longitude")
    try:
        if latitude is not None:
            latitude = float(latitude)
        if longitude is not None:
            longitude = float(longitude)
    except Exception:
        return jsonify({"error": "latitude and longitude must be numbers"}), 400

    unlock_radius_m = int(data.get("unlock_radius_m", 100))

    content = data.get("content")
    # legacy media_url field (single url) accepted
    media_url = data.get("media_url")
    collaborators = [c.strip() for c in (data.get("collaborators") or []) if c.strip()]
    images = data.get("images") or []  # expect base64 data URIs from frontend

    # create capsule
    new_capsule = Capsule(
        title=title,
        content=content,
        media_url=media_url,
        unlock_date=unlock_date,
        created_at=datetime.utcnow(),
        owner_id=user_id,
        latitude=latitude,
        longitude=longitude,
        unlock_radius_m=unlock_radius_m,
    )

    try:
        db.session.add(new_capsule)
        db.session.commit()
    except Exception:
        db.session.rollback()
        return jsonify({"error": "database error creating capsule"}), 500

    # add owner and collaborators
    try:
        db.session.add(CapsuleMember(capsule_id=new_capsule.id, user_id=user_id))
        for email in collaborators:
            user = User.query.filter_by(email=email).first()
            if user:
                db.session.add(CapsuleMember(capsule_id=new_capsule.id, user_id=user.id))
        db.session.commit()
    except Exception:
        db.session.rollback()
        return jsonify({"error": "database error adding members"}), 500

    # Save images (base64 data URIs). store under static/uploads/<capsule_id>/
    if images and isinstance(images, list):
        folder = os.path.join(UPLOAD_ROOT, str(new_capsule.id))
        os.makedirs(folder, exist_ok=True)
        saved_any = False
        for idx, data_uri in enumerate(images):
            try:
                # data:[<mime>];base64,<data>
                if "," in data_uri:
                    header, b64 = data_uri.split(",", 1)
                else:
                    b64 = data_uri
                    header = "data:image/png;base64"
                ext = "png"
                if "jpeg" in header or "jpg" in header:
                    ext = "jpg"
                elif "gif" in header:
                    ext = "gif"
                fname = f"{uuid.uuid4().hex}.{ext}"
                path = os.path.join(folder, fname)
                with open(path, "wb") as fh:
                    fh.write(base64.b64decode(b64))
                saved_any = True
            except Exception as e:
                current_app.logger.exception("Failed saving image: %s", e)
                # continue saving others
                continue

        # if images saved, set first as media_url (relative)
        urls = _capsule_images_urls(new_capsule.id)
        if urls:
            new_capsule.media_url = urls[0]
            try:
                db.session.commit()
            except Exception:
                db.session.rollback()

    return jsonify({"message": "Capsule created!", "capsule_id": new_capsule.id}), 201

# ---------------- GET CAPSULES ----------------
@capsule_bp.route("/capsules", methods=["GET"])
@jwt_required()
def get_capsules():
    user_id = int(get_jwt_identity())
    lat = request.args.get("lat", type=float)
    lng = request.args.get("lng", type=float)

    member_rows = CapsuleMember.query.filter_by(user_id=user_id).all()
    capsule_ids = [m.capsule_id for m in member_rows]
    if not capsule_ids:
        return jsonify({"capsules": []}), 200

    capsules = Capsule.query.filter(Capsule.id.in_(capsule_ids)).all()
    now = datetime.utcnow()
    result = []

    for c in capsules:
        unlocked_date = c.unlock_date <= now
        unlocked_location = True
        distance = None

        if c.latitude is not None and c.longitude is not None:
            if lat is None or lng is None:
                unlocked_location = False
            else:
                distance = distance_m(lat, lng, c.latitude, c.longitude)
                unlocked_location = distance <= (c.unlock_radius_m or 100)

        unlocked = unlocked_date and unlocked_location

        locked_reason = None
        if not unlocked:
            reasons = []
            if not unlocked_date:
                reasons.append("date not reached")
            if c.latitude is not None and c.longitude is not None:
                if distance is not None:
                    reasons.append(f"{round(distance)}m away from unlock location")
                else:
                    reasons.append("location required to unlock")
            locked_reason = "; ".join(reasons) if reasons else "locked"

        # gather image urls from disk
        images = _capsule_images_urls(c.id)

        result.append({
            "id": c.id,
            "title": c.title,
            "unlock_date": c.unlock_date.isoformat(),
            "content": c.content if unlocked else None,
            "locked": not unlocked,
            "locked_reason": locked_reason,
            "latitude": c.latitude,
            "longitude": c.longitude,
            "unlock_radius_m": c.unlock_radius_m,
            "created_at": c.created_at.isoformat(),
            "owner_id": c.owner_id,
            "media_url": c.media_url,
            "images": images,
        })

    return jsonify({"capsules": result}), 200

# ---------------- GET SINGLE CAPSULE ----------------
@capsule_bp.route("/capsules/<int:capsule_id>", methods=["GET"])
@jwt_required()
def get_capsule(capsule_id):
    user_id = int(get_jwt_identity())
    capsule = Capsule.query.get(capsule_id)
    if not capsule:
        return jsonify({"error": "Capsule not found"}), 404

    membership = CapsuleMember.query.filter_by(capsule_id=capsule_id, user_id=user_id).first()
    if not membership:
        return jsonify({"error": "Unauthorized"}), 403

    lat = request.args.get("lat", type=float)
    lng = request.args.get("lng", type=float)
    now = datetime.utcnow()

    unlocked_date = capsule.unlock_date <= now
    unlocked_location = True
    distance = None

    if capsule.latitude is not None and capsule.longitude is not None:
        if lat is None or lng is None:
            unlocked_location = False
        else:
            distance = distance_m(lat, lng, capsule.latitude, capsule.longitude)
            unlocked_location = distance <= (capsule.unlock_radius_m or 100)

    unlocked = unlocked_date and unlocked_location

    locked_reason = None
    if not unlocked:
        reasons = []
        if not unlocked_date:
            reasons.append("date not reached")
        if capsule.latitude is not None and capsule.longitude is not None:
            if distance is not None:
                reasons.append(f"{round(distance)}m away from unlock location")
            else:
                reasons.append("location required to unlock")
        locked_reason = "; ".join(reasons)

    images = _capsule_images_urls(capsule.id)

    return jsonify({
        "id": capsule.id,
        "title": capsule.title,
        "unlock_date": capsule.unlock_date.isoformat(),
        "content": capsule.content if unlocked else None,
        "locked": not unlocked,
        "locked_reason": locked_reason,
        "latitude": capsule.latitude,
        "longitude": capsule.longitude,
        "unlock_radius_m": capsule.unlock_radius_m,
        "created_at": capsule.created_at.isoformat(),
        "owner_id": capsule.owner_id,
        "media_url": capsule.media_url,
        "images": images,
    }), 200

# ---------------- DELETE CAPSULE ----------------
@capsule_bp.route("/capsules/<int:capsule_id>", methods=["DELETE"])
@jwt_required()
def delete_capsule(capsule_id):
    user_id = int(get_jwt_identity())
    capsule = Capsule.query.get(capsule_id)
    if not capsule:
        return jsonify({"error": "Capsule not found"}), 404

    # Only owner can delete
    if capsule.owner_id != user_id:
        return jsonify({"error": "Unauthorized"}), 403

    try:
        # remove uploaded files if exist
        folder = os.path.join(UPLOAD_ROOT, str(capsule_id))
        if os.path.isdir(folder):
            for f in os.listdir(folder):
                try:
                    os.remove(os.path.join(folder, f))
                except Exception:
                    pass
            try:
                os.rmdir(folder)
            except Exception:
                pass

        db.session.delete(capsule)
        db.session.commit()
        return jsonify({"message": "Capsule deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to delete capsule"}), 500
