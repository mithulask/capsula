from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Define a simple model (table)
class Capsule(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    unlock_date = db.Column(db.Date, nullable=False)
    message = db.Column(db.Text, nullable=True)

    def __repr__(self):
        return f"<Capsule {self.title}>"

# Create the tables
with app.app_context():
    db.create_all()

@app.route("/")
def home():
    return "Flask + PostgreSQL database is connected!"

if __name__ == "__main__":
    app.run(debug=True)



