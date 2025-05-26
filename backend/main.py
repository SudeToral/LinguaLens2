from fastapi import FastAPI
from routes.photos import router as photo_router
from routes.objectdetection import  router as objdet_router
app = FastAPI()

app.include_router(photo_router)
app.include_router(objdet_router)