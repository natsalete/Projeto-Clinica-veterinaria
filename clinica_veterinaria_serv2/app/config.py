import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    DATABASE_NAME = os.getenv('DATABASE_NAME', 'pets_db')
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/pets_db")