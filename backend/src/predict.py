# goal : output disease prediction

import os
import torch
import json
import torch.nn.functional as F
from PIL import Image
from torchvision import transforms
from src.model import get_model

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

num_classes = 15

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

MODEL_PATH = os.path.join(BASE_DIR, "models", "plant_disease_model.pth")
CLASS_PATH = os.path.join(BASE_DIR, "models", "classes.json")

# load class names once
with open(CLASS_PATH, "r") as f:
    class_names = json.load(f)

# image preprocessing
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
])

def load_image(image_path):
    image = Image.open(image_path).convert("RGB")
    image = transform(image)
    image = image.unsqueeze(0)
    return image.to(device)


# ----------------------------
# MODEL LOADING (SINGLETON)
# ----------------------------
model = None

def load_model_once():
    global model
    if model is None:
        print("Loading model for first time...")

        model = get_model(num_classes)
        model.load_state_dict(
            torch.load(MODEL_PATH, map_location=device)
        )
        model.to(device)
        model.eval()

    return model


# ----------------------------
# PREDICTION FUNCTION
# ----------------------------
def predict(image_path):
    model = load_model_once()

    image = load_image(image_path)

    with torch.no_grad():
        outputs = model(image)
        probabilities = F.softmax(outputs, dim=1)
        top_probs, top_classes = torch.topk(probabilities, 3)

    predictions = []

    for prob, cls in zip(top_probs[0], top_classes[0]):
        predictions.append({
            "prediction": class_names[cls.item()],
            "confidence": float(prob.item())
        })

    return predictions