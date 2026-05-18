import requests

BASE_URL = "http://127.0.0.1:5000"

# 1️⃣ Register a new user
register_data = {
    "username": "testuser",
    "email": "testuser@example.com",
    "password": "password123"
}

r = requests.post(f"{BASE_URL}/register", json=register_data)
print("Register response:", r.status_code, r.json())

# 2️⃣ Login to get a fresh JWT
login_data = {
    "email": "testuser@example.com",
    "password": "password123"
}

r = requests.post(f"{BASE_URL}/login", json=login_data)
print("Login response:", r.status_code, r.json())

if r.status_code != 200:
    print("Login failed, cannot continue")
    exit()

token = r.json()["access_token"]
headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json"
}

# 3️⃣ Create a new capsule
capsule_data = {
    "title": "Test Capsule",
    "content": "This is a test capsule.",
    "media_url": "https://example.com/image.png",
    "unlock_date": "2025-12-31"  # future date
}

r = requests.post(f"{BASE_URL}/capsules", json=capsule_data, headers=headers)
print("Create capsule response:", r.status_code, r.json())

# 4️⃣ Optional: Debug token
r = requests.post(f"{BASE_URL}/debug-token", headers=headers)
print("Debug token response:", r.status_code, r.json())
