from fastapi import FastAPI, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import io

from . import models, schemas, crud, database
from .database import engine

# Create Database Tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="EduGraph API")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
    return {"message": "EduGraph Backend is Running"}

@app.post("/upload")
async def upload_data(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed.")
    
    contents = await file.read()
    try:
        df = pd.read_csv(io.BytesIO(contents))
        df.columns = df.columns.str.strip() # Clean column names
        
        # Validation checks could go here (check for required columns)
        required_cols = ['student_id', 'student_name', 'subject', 'marks']
        if not all(col in df.columns for col in required_cols):
             raise HTTPException(status_code=400, detail=f"CSV must contain columns: {required_cols}")

        # Clear existing data for fresh upload
        crud.delete_all_data(db)

        # Process Students
        unique_students = df[['student_id', 'student_name']].drop_duplicates()
        student_mapping = {} # csv_id -> db_id

        for _, row in unique_students.iterrows():
            student = crud.create_student(db, csv_id=row['student_id'], name=row['student_name'])
            student_mapping[row['student_id']] = student.id
        
        # Process Scores
        for _, row in df.iterrows():
            system_id = student_mapping[row['student_id']]
            crud.create_score(db, student_id=system_id, subject=row['subject'], marks=row['marks'])

        return {"message": "Data successfully processed and stored."}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

@app.get("/students", response_model=List[schemas.Student])
def read_students(db: Session = Depends(get_db)):
    students = crud.get_students(db)
    return students
