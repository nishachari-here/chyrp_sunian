# backend/main.py

import os
from dotenv import load_dotenv
from firebase_admin import credentials, firestore, initialize_app
from fastapi import FastAPI

# Load environment variables from .env file
load_dotenv()

# Get the path to the credentials file from the environment variable
# The .env file is loaded automatically, so no need for the full path
cred_path = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")

if not cred_path:
    raise ValueError("GOOGLE_APPLICATION_CREDENTIALS environment variable not set.")

cred = credentials.Certificate(cred_path)
initialize_app(cred)

db = firestore.client()
app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI!"}

@app.get("/posts")
def get_posts():
    # Example to get data from Firestore
    posts_ref = db.collection('posts')
    docs = posts_ref.stream()
    posts = [doc.to_dict() for doc in docs]
    return posts