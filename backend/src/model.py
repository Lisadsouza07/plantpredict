# implement transfer learning

'''taking a pretrained CNN (ResNet)
replacing the final layer
adapting it to your plant classes'''

# Import

import torch.nn as nn
from torchvision.models import resnet18, ResNet18_Weights

def get_model(num_classes):
    # Load pretrained model ResNet (already trained on ImageNet)
    model = resnet18(weights = ResNet18_Weights.DEFAULT)

    # Freeze Feature Extracter Layers
    for param in model.parameters():
        param.requires_grad = False
    
    # replace final classification layer
    model.fc = nn.Linear(model.fc.in_features, num_classes)

    return model




