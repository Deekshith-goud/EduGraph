from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Start with default root/no-password usage pattern frequently found in dev envs
# It's easy for the user to change this file if needed.
SQLALCHEMY_DATABASE_URL = "mysql+pymysql://root:@localhost:3306/edugraph"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
