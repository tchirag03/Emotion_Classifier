from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from tensorflow.keras.models import load_model
import numpy as np
from PIL import Image
import io

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://emotion-classifier-frontend.onrender.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def load_ml_model():
    global model
    model = load_model('model.h5')
    print("Model loaded successfully.")

@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()

    # force grayscale to match (48, 48, 1)
    image = Image.open(io.BytesIO(contents)).convert("L").resize((48, 48))
    image_array = np.array(image) / 255.0        # shape: (48, 48)
    image_array = np.expand_dims(image_array, axis=-1)  # (48, 48, 1)
    image_array = np.expand_dims(image_array, axis=0)   # (1, 48, 48, 1)

    predictions = model.predict(image_array)
    predicted_class = np.argmax(predictions, axis=1)[0]
    labels = {
        0: "angry",
        1: "disgust",
        2: "fear",
        3: "happy",
        4: "neutral",
        5: "sad",
        6: "surprise",
    }

    return {"label": labels[predicted_class]}
