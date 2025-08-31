import os
from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from firebase_admin import credentials, firestore, initialize_app, auth
from routers import posts

# Load environment variables from .env file
load_dotenv()

# Get the path to the credentials file from the environment variable
cred_path = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")

if not cred_path:
    raise ValueError("GOOGLE_APPLICATION_CREDENTIALS environment variable not set.")

# Initialize Firebase with credentials and storage bucket
try:
    cred = credentials.Certificate(cred_path)
    initialize_app(cred, {
        'storageBucket': os.environ.get("FIREBASE_STORAGE_BUCKET")
    })
    print("Firebase app initialized successfully.")
except ValueError as e:
    raise RuntimeError(f"Error initializing Firebase: {e}")

db = firestore.client()
app = FastAPI(title="Chyrp Modernized API")

# Dependency to verify Firebase ID token
def get_current_user(token: str = Depends(auth.verify_id_token)):
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except auth.InvalidIdTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

# This is a placeholder for your frontend's URL.
origins = [
    "http://localhost:3000", # The URL of your React frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include your routers. The 'get_current_user' dependency will be applied to all endpoints
# in the posts router, ensuring they are protected.
app.include_router(posts.router, dependencies=[Depends(get_current_user)])
