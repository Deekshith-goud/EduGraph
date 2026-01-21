from fastapi import FastAPI, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from typing import List
import pandas as pd
import io

from . import models, database
from .database import engine

from fastapi.middleware.cors import CORSMiddleware

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="EduGraph API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for dev convenience
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Welcome to EduGraph API"}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a CSV.")
    
    content = await file.read()
    try:
        df = pd.read_csv(io.BytesIO(content))
        # Expected columns: student_id, student_name, subject, marks
        df.columns = df.columns.str.strip()
        
        # Clear existing data? Or append? 
        # For simplicity in this demo, let's clear data first to avoid duplicates or complexity
        # In a real app we might want upsert logic.
        db.query(models.Score).delete()
        db.query(models.Student).delete()
        db.commit()

        # Process data
        # Get unique students
        unique_students = df[['student_id', 'student_name']].drop_duplicates()
        
        student_map = {} # Map csv_id to db_id
        
        for _, row in unique_students.iterrows():
            student = models.Student(student_id_csv=row['student_id'], name=row['student_name'])
            db.add(student)
            db.commit() # Commit to get ID
            db.refresh(student)
            student_map[row['student_id']] = student.id
            
        # Add scores
        for _, row in df.iterrows():
            db_student_id = student_map[row['student_id']]
            score = models.Score(
                subject=row['subject'],
                marks=row['marks'],
                student_id=db_student_id
            )
            db.add(score)
            
        db.commit()
        
        return {"message": f"Successfully processed {len(df)} records."}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

@app.get("/students")
def get_students(db: Session = Depends(get_db)):
    return db.query(models.Student).all()

@app.get("/students/{student_id}")
def get_student_performance(student_id: int, db: Session = Depends(get_db)):
    # CAUTION: student_id here refers to the Database Primary Key ID, not the CSV ID.
    # We should probably expost the CSV ID for clarity or searching. 
    # However, let's stick to the DB ID for clean API practices, or we can search by CSV ID.
    
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Return student info with scores
    return {
        "id": student.id,
        "csv_id": student.student_id_csv,
        "name": student.name,
        "scores": [{"subject": s.subject, "marks": s.marks} for s in student.scores]
    }
