'''This script should:

Load dataset
Count classes
Count images per class
Check image sizes
Visualize samples'''

#imports

import os
import matplotlib.pyplot as plt
import seaborn as sns
import random
from PIL import Image

#load dataset

DATASET_DIR = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "plantvillagedata"))

#count classes
classes = os.listdir(DATASET_DIR)
print("Number of classes:", len(classes))
classes.sort()
print(classes)

#count images per class
    # handle empty folders or corrupted images
class_counts = {}
for cls in classes:
    path = os.path.join(DATASET_DIR, cls)
    images = os.listdir(path)
    class_counts[cls] = len(images)

plt.figure(figsize=(10,4))
sns.barplot(x=list(class_counts.keys()), y=list(class_counts.values()))
plt.xticks(rotation=90, fontsize = 8)
plt.title("Class Distribution (Imbalanced Dataset)")
plt.show()


# check image size
sample_class = classes[0]
sample_img_path = os.path.join(DATASET_DIR, sample_class, os.listdir(os.path.join(DATASET_DIR, sample_class))[0])

img = Image.open(sample_img_path)

print("Image size:", img.size)

# visualize sample images

plt.figure(figsize=(10,5))

for i, cls in enumerate(classes[:5]):
    img_name = random.choice(os.listdir(os.path.join(DATASET_DIR, cls)))
    img_path = os.path.join(DATASET_DIR, cls, img_name)

    img = Image.open(img_path)

    plt.subplot(1,5,i+1)
    plt.imshow(img)
    plt.title(cls[:10])
    plt.axis("off")

plt.show()