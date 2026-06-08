# turn raw images into pyTorch DataLoader
# we need to turn folders of images into batches the model can learn from
import os
DATASET_DIR = "backend/plantvillagedata"
from torchvision import transforms, datasets
from torch.utils.data import DataLoader, random_split

'''loading images
preprocessing
labeling
batching
splitting into train/validation'''

# transform images 
# resnet expects 224 x 224 so we need to resize
# pytorch cannot use raw images so we need to convert to tensors

transform = transforms.Compose([
    transforms.Resize((224,224)),
    transforms.ToTensor(),
])

# load dataset (pytorch reads images and automatically assigns labels using this)

dataset = datasets.ImageFolder(
    root = DATASET_DIR,
    transform = transform
)

# train validation split (80% train 20% evaluate)
# validation - provides unbiased feedback so you can tune the model's settings
train_size = int(0.8 * len(dataset))
val_size = len(dataset) - train_size

train_data, val_data = random_split(dataset, [train_size, val_size])

# dataloader (gives images in batches rather than one by one)

train_loader = DataLoader(train_data, batch_size = 32, shuffle= True)
val_loader = DataLoader(val_data, batch_size = 32)

# DEBUG INFO

if __name__ == "__main__":
    print("Dataset size:", len(dataset))
    print("Classes:", dataset.classes)

    # grab one batch from dataloader
    images, labels = next(iter(train_loader))

    print("Batch image shape:", images.shape)
    print("Batch label shape:", labels.shape)

    print("First 5 labels:", labels[:5])