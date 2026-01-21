from sqlalchemy.orm import Session
from . import models

def get_student(db: Session, student_id: int):
    return db.query(models.Student).filter(models.Student.id == student_id).first()

def get_students(db: Session):
    return db.query(models.Student).all()

def get_student_by_csv_id(db: Session, csv_id: int):
    return db.query(models.Student).filter(models.Student.student_csv_id == csv_id).first()

def create_student(db: Session, csv_id: int, name: str):
    db_student = models.Student(student_csv_id=csv_id, name=name)
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student

def create_score(db: Session, student_id: int, subject: str, marks: float):
    db_score = models.Score(student_id=student_id, subject=subject, marks=marks)
    db.add(db_score)
    db.commit()
    db.refresh(db_score)
    return db_score

def delete_all_data(db: Session):
    db.query(models.Score).delete()
    db.query(models.Student).delete()
    db.commit()
