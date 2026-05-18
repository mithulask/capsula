from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from datetime import datetime

db = SQLAlchemy()
bcrypt = Bcrypt()

# Use this metadata for Alembic
target_metadata = db.Model.metadata


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    capsules = db.relationship("Capsule", backref="owner", lazy=True)

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode("utf-8")

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)


class Capsule(db.Model):
    __tablename__ = "capsules"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=True)
    media_url = db.Column(db.String(500), nullable=True)
    unlock_date = db.Column(db.DateTime, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    owner_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    # Location-based columns
    latitude = db.Column(db.Float, nullable=True)
    longitude = db.Column(db.Float, nullable=True)
    unlock_radius_m = db.Column(db.Integer, nullable=True, default=100)

    members = db.relationship("CapsuleMember", backref="capsule", cascade="all, delete")


class CapsuleMember(db.Model):
    __tablename__ = "capsule_members"

    id = db.Column(db.Integer, primary_key=True)
    capsule_id = db.Column(db.Integer, db.ForeignKey("capsules.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
