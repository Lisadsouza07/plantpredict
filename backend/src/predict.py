# goal : output disease prediction

# leaf image -> preprocess image -> load trained model -> predict disease -> return class + confidence

# imports
import torch
import json
import torch.nn.functional as F
from PIL import Image
from torchvision import transforms
from src.model import get_model

# load model
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

num_classes = 15  # or load dynamically later

model = get_model(num_classes)
model.load_state_dict(torch.load("../models/plant_disease_model.pth", map_location=device))
model = model.to(device)
model.eval()

with open("../models/classes.json", "r") as f:
    class_names = json.load(f)

# image preprocessing
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
])

# load + preprocess image
def load_image(image_path):
    image = Image.open(image_path).convert("RGB")
    image = transform(image)
    image = image.unsqueeze(0)
    return image.to(device)

def predict(image_path):
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
