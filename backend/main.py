# backend/main.py

import os
from dotenv import load_dotenv
from firebase_admin import credentials, firestore, initialize_app
from fastapi import FastAPI, HTTPException
from datetime import datetime
from .models import PostIn 

# Initialize your FastAPI app and Firestore client
app = FastAPI()
db = firestore.client()

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
@app.post("/posts")
def create_post(post: PostIn):
    try:
        # Create a new document in the 'posts' collection
        new_post_ref = db.collection("posts").document()
        
        # Convert the Pydantic model to a dictionary
        post_data = post.dict()
        
        # Add the timestamp to the data
        post_data["timestamp"] = datetime.now()

        # Set the data in the new document
        new_post_ref.set(post_data)

        return {"message": "Post created successfully", "post_id": new_post_ref.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {e}")