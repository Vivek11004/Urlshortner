from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os

load_dotenv()  # 👈 loads .env from project root

DATABASE_URL = os.getenv("DATABASE_URL")
print("USING DB:", DATABASE_URL)  # temporary debug

engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()