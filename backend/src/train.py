'''This is where learning actually happens:

forward pass
loss calculation
backpropagation
optimizer step'''

# imports

import torch
import torch.nn as nn
import torch.optim as optim
import os

from dataset import train_loader, val_loader
from model import get_model

# Device setup (If available use GPU else CPU)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# get number of classes
num_classes = len(train_loader.dataset.dataset.classes)

# move model to gpu/cpu
model = get_model(num_classes)
model = model.to(device)

# Loss function
criterion = nn.CrossEntropyLoss()

# Optimiser (Only training last layer Adam automoatically adjusts weights)

optimizer = optim.Adam(model.fc.parameters(), lr = 0.001)

## TRAINING LOOP
epochs = 5

for epoch in range(epochs):
    print(f"\nEpoch {epoch+1}/{epochs}")
    
    model.train()
    train_loss = 0
    correct = 0
    total = 0

    for batch_idx, (images, labels) in enumerate(train_loader):
       
        images, labels = images.to(device), labels.to(device)

        # forward pass (image -> model -> prediction)
        outputs = model(images)
        # loss calculation (measures how wrong the model is)
        loss = criterion(outputs, labels)
        optimizer.zero_grad()
        # backpropogation
        loss.backward()
        # update weights
        optimizer.step()

        if batch_idx % 50 == 0:
            print(
            f"Epoch {epoch+1}/{epochs} | "
            f"Batch {batch_idx}/{len(train_loader)} | "
            f"Loss: {loss.item():.4f}"
          )

        train_loss += loss.item()
        _, predicted = torch.max(outputs, 1)
        total += labels.size(0)
        correct += (predicted == labels).sum().item()
    
    train_acc = 100 * correct/total

## VALIDATION PHASE

    # turns off training behaviour
    model.eval()
    val_correct = 0
    val_total = 0

    with torch.no_grad():
        for images, labels in val_loader:
            images, labels = images.to(device), labels.to(device)

            outputs = model(images)
            _, predicted = torch.max(outputs, 1)

            val_total += labels.size(0)
            val_correct += (predicted == labels).sum().item()
        
        val_acc = 100 * val_correct/ val_total
        print(f"Train Accuracy: {train_acc:.2f}%")
        print(f"Test Accuracy: {val_acc:.2f}%")

## SAVE MODEL

save_path = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    "..",
    "models",
    "plant_disease_model.pth"
)

# Create models directory if it doesn't exist
os.makedirs(os.path.dirname(save_path), exist_ok=True)

torch.save(model.state_dict(), save_path)

print(f"\nModel saved to {save_path}")
