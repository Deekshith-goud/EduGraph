from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    student_csv_id = Column(Integer, unique=True, index=True) # ID from the CSV file (e.g., 101)
    name = Column(String(255))

    scores = relationship("Score", back_populates="student", cascade="all, delete-orphan")

class Score(Base):
    __tablename__ = "scores"

    id = Column(Integer, primary_key=True, index=True)
    subject = Column(String(255))
    marks = Column(Float)
    
    student_id = Column(Integer, ForeignKey("students.id"))
    student = relationship("Student", back_populates="scores")
