from fastapi import APIRouter, UploadFile, File, HTTPException, status, Form, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from firebase_admin import credentials, firestore, initialize_app
import requests
import os
from dotenv import load_dotenv
from pathlib import Path
from datetime import datetime
from config.cloudinary import *
from cloudinary.uploader import upload
import json

router = APIRouter()
load_dotenv()

# Initialize Firebase
cred_path = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")
if not cred_path:
    raise ValueError("GOOGLE_APPLICATION_CREDENTIALS environment variable not set.")

cred_path = Path(cred_path).expanduser().resolve()
if not cred_path.is_file():
    raise FileNotFoundError(f"Firebase credential file not found: {cred_path}")

cred = credentials.Certificate(str(cred_path))
initialize_app(cred)
db = firestore.client()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PostData(BaseModel):
    title: str
    content: str
    author_uid: str
    post_type: str
    image_url: str = None

class AuthRequest(BaseModel):
    email: str
    password: str
    username: str | None = None   # ✅ allow username during signup

# Use the correct API key from your Firebase project settings
FIREBASE_API_KEY = os.environ.get("FIREBASE_WEB_API_KEY")
if not FIREBASE_API_KEY:
    raise ValueError("FIREBASE_WEB_API_KEY environment variable not set.")

@app.post("/signup")
def signup(request: AuthRequest):
    url = f"https://identitytoolkit.googleapis.com/v1/accounts:signUp?key={FIREBASE_API_KEY}"
    payload = {
        "email": request.email,
        "password": request.password,
        "returnSecureToken": True
    }
    resp = requests.post(url, json=payload)
    if resp.status_code == 200:
        data = resp.json()
        # ✅ save username + email in Firestore under localId
        db.collection("users").document(data["localId"]).set({
            "username": request.username,
            "email": request.email,
            "created_at": datetime.now()
        })
        # also return username so frontend can use it
        data["username"] = request.username
        return data
    else:
        raise HTTPException(
            status_code=400,
            detail=resp.json().get("error", {}).get("message", "Signup failed")
        )

@app.post("/login")
def login(request: AuthRequest):
    url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={FIREBASE_API_KEY}"
    payload = {
        "email": request.email,
        "password": request.password,
        "returnSecureToken": True
    }
    resp = requests.post(url, json=payload)
    if resp.status_code == 200:
        data = resp.json()
        # ✅ fetch username from Firestore
        user_doc = db.collection("users").document(data["localId"]).get()
        if user_doc.exists:
            data["username"] = user_doc.to_dict().get("username")
        return data
    else:
        raise HTTPException(status_code=401, detail="Invalid credentials")

@app.post("/posts")
def create_post(
    title: str = Form(...),
    content: str = Form(...),
    author_uid: str = Form(...),
    post_type: str = Form(...),
    file: UploadFile = File(None),
    tags: str = Form("[]") # to accept the tags
):
    try:
        # 🔑 get username from Firestore
        user_doc = db.collection("users").document(author_uid).get()
        username = None
        if user_doc.exists:
            username = user_doc.to_dict().get("username")

        # Handle file upload if a file exists
        file_url = None
        if file and file.filename:
            # Cloudinary's resource_type="auto" automatically handles images, videos, audio, etc.
            upload_result = upload(file.file, resource_type="auto")
            file_url = upload_result.get("secure_url")
            
        # Parse tags from the JSON string
        try:
            parsed_tags = json.loads(tags)
        except json.JSONDecodeError:
            parsed_tags = []

        post_data = {
            "title": title,
            "content": content,
            "author_uid": author_uid,
            "author": username,
            "type": post_type,
            "timestamp": datetime.now(),
            "file_url": file_url,  # Use a generic key for all file types
            "tags": parsed_tags # Store the parsed tags
        }

        db.collection("posts").add(post_data)
        return {"message": "Post created successfully", "post_data": post_data}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {e}")

@app.get("/posts")
def get_posts():
    posts_ref = db.collection("posts")
    docs = posts_ref.stream()
    posts = [doc.to_dict() for doc in docs]
    return posts

@app.get("/users/{user_uid}/posts")
def get_user_posts(user_uid: str):
    try:
        posts_ref = db.collection("posts")
        query = posts_ref.where("author_uid", "==", user_uid).order_by(
            "timestamp", direction=firestore.Query.DESCENDING
        )
        docs = query.stream()
        posts = []
        for doc in docs:
            post_data = doc.to_dict()
            post_data["id"] = doc.id
            posts.append(post_data)

        return {"posts": posts}

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred: {e}"
        )
