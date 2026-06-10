# goal : output disease prediction

# leaf image -> preprocess image -> load trained model -> predict disease -> return class + confidence

# imports
import torch
import json
import torch.nn.functional as F
from PIL import Image
from torchvision import transforms
from model import get_model

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
        probabilites = F.softmax(outputs, dim = 1)

        confidence, predicted_class = torch.max(probabilites, 1)
    
    predicted_label = class_names[predicted_class.item()]
    confidence_score = confidence.item()

    return predicted_label, float(confidence_score)
