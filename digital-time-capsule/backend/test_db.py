from sqlalchemy import create_engine

# Replace with your .env credentials if you want
DATABASE_URL = "postgresql://postgres:miraethi111@localhost:5432/capsula_db"

# Create the engine
engine = create_engine(DATABASE_URL)

# Try to connect
try:
    conn = engine.connect()
    print("Connected successfully!")
    conn.close()
except Exception as e:
    print("Connection failed!")
    print(e)
