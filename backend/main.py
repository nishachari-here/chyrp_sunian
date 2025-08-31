from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from firebase_admin import credentials, firestore, initialize_app
import requests
import os
from dotenv import load_dotenv
from pathlib import Path

load_dotenv()

# Initialize Firebase
cred_path = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")
if not cred_path:
    raise ValueError("GOOGLE_APPLICATION_CREDENTIALS environment variable not set.")

# Convert to a proper Path object to avoid \b issues and make it cross-platform
cred_path = Path(cred_path).expanduser().resolve()

if not cred_path.is_file():
    raise FileNotFoundError(f"Firebase credential file not found: {cred_path}")

cred = credentials.Certificate(str(cred_path))
initialize_app(cred)
db = firestore.client()

app = FastAPI()

# Allow frontend to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For dev only, restrict in prod!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class BlogPost(BaseModel):
    title: str
    content: str
    author: str

class AuthRequest(BaseModel):
    email: str
    password: str

FIREBASE_API_KEY = "AIzaSyB2GfePojT71ta3qhtYV6Yu3BiUbiw594I"  # <-- Replace with your Firebase project's Web API Key

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
        return resp.json()
    else:
        raise HTTPException(status_code=400, detail=resp.json().get("error", {}).get("message", "Signup failed"))

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
        return resp.json()
    else:
        raise HTTPException(status_code=401, detail="Invalid credentials")

@app.post("/posts")
def create_post(post: BlogPost):
    db.collection('posts').add(post.dict())
    return {"message": "Post created!"}

@app.get("/posts")
def get_posts():
    posts_ref = db.collection('posts')
    docs = posts_ref.stream()
    posts = [doc.to_dict() for doc in docs]
    return posts
