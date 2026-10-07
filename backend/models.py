from sqlalchemy import Column, Integer, String
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    role = Column(String, default="Patient")
    age = Column(Integer, default=25)
    blood_group = Column(String, default="O+")
    phone = Column(String, default="")
    medical_history = Column(String, default="None")

class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    patient_name = Column(String, index=True)
    patient_email = Column(String, index=True)
    age = Column(Integer)
    blood_group = Column(String)
    medical_history = Column(String)
    department = Column(String)
    appointment_date = Column(String)
    urgency = Column(String)
    attached_file = Column(String, default="None")
    ai_analysis = Column(String, default="")