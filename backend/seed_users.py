from database import SessionLocal
from models import User
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
db = SessionLocal()

# Inspect User model attributes for password column
user_attrs = [attr for attr in dir(User) if not attr.startswith('_')]
pwd_field = None
for candidate in ['hashed_password', 'password_hash', 'password', 'pass_hash']:
    if candidate in user_attrs:
        pwd_field = candidate
        break

if not pwd_field:
    pwd_field = 'hashed_password'

users_data = [
    {
        "name": "Admin User",
        "email": "admin@medilink.com",
        "role": "admin",
        "password": "password123"
    },
    {
        "name": "Doctor User",
        "email": "doctor@medilink.com",
        "role": "doctor",
        "password": "password123"
    },
    {
        "name": "Patient User",
        "email": "patient@medilink.com",
        "role": "patient",
        "password": "password123"
    }
]

try:
    for user_info in users_data:
        existing = db.query(User).filter(User.email == user_info["email"]).first()
        hashed = pwd_context.hash(user_info["password"])
        if existing:
            setattr(existing, pwd_field, hashed)
            print(f"Updated password for: {user_info['email']}")
        else:
            user_kwargs = {
                "name": user_info["name"],
                "email": user_info["email"],
                "role": user_info["role"],
                pwd_field: hashed
            }
            new_user = User(**user_kwargs)
            db.add(new_user)
            print(f"Created user: {user_info['email']}")

    db.commit()
    print("\n--- Passwords Successfully Reset & Seeded! ---")
except Exception as e:
    print("Error seeding database:", e)
    db.rollback()
finally:
    db.close()