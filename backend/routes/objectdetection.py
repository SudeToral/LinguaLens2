from fastapi import APIRouter, FastAPI, UploadFile, File
from pydantic import BaseModel
import io, base64
from PIL import Image
import numpy as np
from ultralytics import YOLO

router = APIRouter()

# Load your YOLOv11-n model (replace with your actual weights path)
model = YOLO('yolo11n.pt')

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