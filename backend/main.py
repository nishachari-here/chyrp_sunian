from fastapi import FastAPI
from firebase_admin import credentials, firestore, initialize_app

# Initialize Firebase
cred = credentials.Certificate("C:\Users\nithy\Downloads\chyrp-sunian-firebase-adminsdk-fbsvc-36874bc5b5.json")
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