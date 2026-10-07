from database import engine, Base
from sqlalchemy import text
import models

with engine.connect() as conn:
    conn.execute(text("DROP TABLE IF EXISTS users CASCADE;"))
    conn.execute(text("DROP TABLE IF EXISTS patient_profiles CASCADE;"))
    conn.execute(text("DROP TABLE IF EXISTS appointments CASCADE;"))
    conn.commit()

Base.metadata.create_all(bind=engine)
print("Database schema successfully reset!")