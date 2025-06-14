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
    label: str  # detected class or "no word"

@router.post('/detect/', response_model=DetectOutput)
async def detect_largest(file: UploadFile = File(...)):
    img_bytes = await file.read()
    img = Image.open(io.BytesIO(img_bytes)).convert('RGB')

    results = model(img)
    boxes = results[0].boxes.xyxy.cpu().numpy() if hasattr(results[0].boxes, 'xyxy') else np.array([]).reshape(0, 4)
    confs = results[0].boxes.conf.cpu().numpy() if hasattr(results[0].boxes, 'conf') else np.array([])
    classes = results[0].boxes.cls.cpu().numpy() if hasattr(results[0].boxes, 'cls') else np.array([])

    # Tüm tespitleri yazdır
    if len(classes) > 0:
        for i in range(len(classes)):
            class_id = int(classes[i])
            confidence = float(confs[i])
            class_name = results[0].names[class_id]
            print(f"Detected: {class_name} ({confidence:.2%})")

    # ✅ %55 ve üstü olanları filtrele
    valid_indices = [i for i in range(len(confs)) if confs[i] >= 0.20]
    if not valid_indices:
        crop_img = img
        label = "no word"
    else:
        # En büyük kutuyu bul (sadece %55 üstü confidence olanlar arasından)
        filtered_boxes = boxes[valid_indices]
        filtered_confs = confs[valid_indices]
        filtered_classes = classes[valid_indices]

        areas = (filtered_boxes[:, 2] - filtered_boxes[:, 0]) * (filtered_boxes[:, 3] - filtered_boxes[:, 1])
        idx = int(np.argmax(areas))

        x1, y1, x2, y2 = filtered_boxes[idx].astype(int)
        crop_img = img.crop((x1, y1, x2, y2))
        label_id = int(filtered_classes[idx])
        label = results[0].names[label_id]

    buf = io.BytesIO()
    crop_img.save(buf, format='JPEG')
    b64 = base64.b64encode(buf.getvalue()).decode()
    data_uri = f"data:image/jpeg;base64,{b64}"
    print("YOLO-World final selection:", label)
    return DetectOutput(image=data_uri, label=label)