from fastapi import FastAPI, File, UploadFile

from fastapi.middleware.cors import CORSMiddleware

import shutil
import os

from src.predict import predict

app = FastAPI()

# allow frontend access (allows future React frontend to talk to backend)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # later restrict to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# create upload endpoint

UPLOAD_DIR = "temp_uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# create url route so your server has an endpoint
@app.post("/predict")
# receiving uploaded image
async def predict_image(file: UploadFile = File(...)):
    # saving image
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    # save uploaded file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # run model

    predictions = predict(file_path)

    return {
        "predictions": predictions
    }