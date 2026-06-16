# 🌿 Plant Disease Detection System

An end-to-end machine learning web application that detects plant diseases from leaf images using deep learning. Users can upload an image of a plant leaf and receive real-time disease predictions through an intuitive web interface.

## 🚀 Features

- 🔍 Detects **15 plant diseases** from leaf images
- 🧠 Deep learning model built with **PyTorch**
- 📈 Displays **Top-3 predictions with confidence scores**
- ⚡ FastAPI backend for real-time inference
- 🎨 React frontend with drag-and-drop image upload
- ☁️ Deployed using **Render** (backend) and **Vercel** (frontend)
- 📱 Responsive UI optimized for desktop and mobile devices

---

## 🛠️ Technologies Used

### Machine Learning
- Python
- PyTorch
- Torchvision
- PIL (Pillow)

### Backend
- FastAPI
- Uvicorn

### Frontend
- React
- JavaScript
- Tailwind CSS
- Framer Motion

### Development Tools
- Git & GitHub
- VS Code

---

## 🏗️ System Architecture

```text
Leaf Image
    ↓
React Frontend
    ↓
FastAPI Backend
    ↓
Image Preprocessing
    ↓
PyTorch ResNet18 Model
    ↓
Top-3 Disease Predictions
    ↓
Frontend Visualization
```

---

## 📊 Model Performance

| Metric | Result |
|---------|---------|
| Model Architecture | ResNet18 (Transfer Learning) |
| Number of Classes | 15 |
| Validation Accuracy | **92.6%** |
| Framework | PyTorch |

---

## 📂 Project Structure

```text
plantpredict/
├── backend/
│   ├── src/
│   │   ├── app.py
│   │   ├── model.py
│   │   ├── dataset.py
│   │   ├── train.py
│   │   └── predict.py
│   ├── models/
│   │   ├── plant_disease_model.pth
│   │   └── classes.json
│   └── uploads/
│
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── index.css
│   │   └── components/
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation

### Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/plantpredict.git
cd plantpredict
```

---

## 🧠 Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI server:

```bash
uvicorn src.app:app --reload
```

Backend runs at:

```text
http://127.0.0.1:8000
```

---

## 🎨 Frontend Setup

Open a new terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the React application:

```bash
npm start
```

Frontend runs at:

```text
http://localhost:3000
```

---

## 🖼️ Usage

1. Launch the backend server.
2. Start the React frontend.
3. Upload a leaf image.
4. Click **Predict**.
5. View the **Top-3 disease predictions** along with confidence scores.


---

## 🔮 Future Improvements

- [ ] Grad-CAM visualizations for model interpretability
- [ ] Disease treatment recommendations
- [ ] Expanded support for additional crop species

