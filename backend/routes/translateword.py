import io
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class TranslateRequest(BaseModel):
    word: str

class TranslateResponse(BaseModel):
    translated_word: str

@router.post("/translate", response_model=TranslateResponse)
async def translate(req: TranslateRequest):

    

    translated = "translatedWord"  # placeholder
    return TranslateResponse(translated_word=translated)