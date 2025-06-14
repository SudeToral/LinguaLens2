from fastapi import APIRouter, FastAPI, UploadFile, File
from pydantic import BaseModel
import io, base64
from PIL import Image
import numpy as np
from ultralytics import YOLO
import os
import openai

router=APIRouter()


CLASSES = [
    # COCO CLASSES
    "person","key","keychain", "duster" ,"bicycle", "car", "motorcycle",  "bus", "train", "truck", "boat",
    "traffic light", "stop sign", "bench", "bird", "cat",
    "dog", "horse", "sheep", "cow", "elephant", "bear", "zebra", "giraffe", "backpack",
     "handbag", "tie", "suitcase", "frisbee", "skis", "snowboard", "sports ball",
    "kite", "skateboard", "surfboard", "tennis racket",
    "bottle", "wine glass", "cup", "fork", "knife", "spoon", "bowl", "banana", "apple",
    "sandwich", "orange", "broccoli", "carrot", "hot dog", "pizza", "donut", "cake", "chair",
    "couch", "potted plant", "bed", "dining table", "toilet", "tv", "laptop", "mouse", "remote",
    "keyboard", "cell phone","phone","smart phone", "microwave", "oven", "toaster", "sink", "refrigerator", "book",
    "clock", "vase", "scissors",

    # LINGUALENS VOCABULARY
    "notebook", "pen", "bottle","pencil","ballpoint pen", "ink pen", "marker", "writing tool", "eraser", "ruler", "crayon", "whiteboard", "blackboard",
    "chalk", "marker", "glue stick", "highlighter", "desk", "folder", "calendar", "lamp",
    "window", "door", "fan", "light switch", "mirror", "plant", "water bottle", "bag", "wallet",
    "phone charger", "headphones", "earbuds", "key", "shoe", "sock", "hat", "jacket", "glasses",
    "umbrella", "watch", "mask", "plate", "napkin", "cupboard", "mug", "pan", "pot", "frying pan",
    "spatula", "vacuum", "soap", "towel", "shampoo", 
     "lego", "blocks", "doll", "ball", "guitar", "piano", "drum", "microphone",
    "camera", "tripod", "paintbrush", "easel", "globe", "map", "flag", "coin", "money", 
    "id card", "passport", "keyboard", "monitor", "charger", "mouse pad", "usb stick", "flash drive"
]

# ✅ YOLOv8s-World modeli yükleniyor
model = YOLO("yolov8s-world.pt")
model.set_classes(CLASSES)

class DetectOutput(BaseModel):
    image: str  # base64-encoded cropped region
    label: str  # YOLO'dan dönen kelime veya "no word"

@router.post('/detect/', response_model=DetectOutput)
async def detect_largest(file: UploadFile = File(...)):

    img_bytes = await file.read()
    img = Image.open(io.BytesIO(img_bytes)).convert('RGB')

    results = model(img)

    boxes = results[0].boxes.xyxy.cpu().numpy() if hasattr(results[0].boxes, 'xyxy') else np.array([]).reshape(0, 4)

    if boxes.shape[0] == 0:
        crop_img = img
        label = "no word"
    else:
        areas = (boxes[:, 2] - boxes[:, 0]) * (boxes[:, 3] - boxes[:, 1])
        idx = int(np.argmax(areas))
        x1, y1, x2, y2 = boxes[idx].astype(int)
        crop_img = img.crop((x1, y1, x2, y2))

        # ✅ En büyük nesnenin sınıf adını al
        label_id = int(results[0].boxes.cls[idx])
        label = results[0].names[label_id]

    buf = io.BytesIO()
    crop_img.save(buf, format='JPEG')
    b64 = base64.b64encode(buf.getvalue()).decode()
    data_uri = f"data:image/jpeg;base64,{b64}"
    print("YOLO found: " + label)
    return DetectOutput(image=data_uri, label=label)