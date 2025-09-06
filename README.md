# chyrp_sunian

1. Clone the repo locally
2. For backend deployment: <br>
   `cd chyrp_sunian` <br>
   `cd backend` <br>
   `pip install -r requirements.txt` <br>
   `uvicorn main:app --reload` <br>
3. For frontend deployemnt:
   `cd chyrp_sunian` <br>
   `cd chryp_pro` <br>
   `npm install` (needed only for the first time) <br>
   `npm run dev` <br>
4. add GOOGLE_APPLICATION_CREDENTIALS = "Path to firebase adminsdk file" <br>
   example: GOOGLE_APPLICATION_CREDENTIALS = "C:\Users\Anush\OneDrive\Documents\CloneFest Chyrp\chyrp_sunian\backend\chyrp-sunian-firebase-adminsdk-fbsvc-0e4d36f228.json"
