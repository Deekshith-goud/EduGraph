from pydantic import BaseModel
from typing import List

class ScoreBase(BaseModel):
    subject: str
    marks: float

class Score(ScoreBase):
    id: int
    student_id: int

    class Config:
        orm_mode = True

class StudentBase(BaseModel):
    student_csv_id: int
    name: str

class Student(StudentBase):
    id: int
    scores: List[Score] = []

    class Config:
        orm_mode = True
