from sqlalchemy import Column, Integer, String, ForeignKey, Float
from sqlalchemy.orm import relationship
from .database import Base

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    # Using the CSV's student_id as a unique identifier if possible, 
    # but let's keep it flexible.
    # The CSV has student_id (e.g. 101).
    student_id_csv = Column(Integer, unique=True, index=True) 
    name = Column(String(255))
    
    scores = relationship("Score", back_populates="student")

class Score(Base):
    __tablename__ = "scores"

    id = Column(Integer, primary_key=True, index=True)
    subject = Column(String(255))
    marks = Column(Float)
    student_id = Column(Integer, ForeignKey("students.id"))

    student = relationship("Student", back_populates="scores")
