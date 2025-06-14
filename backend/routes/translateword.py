import os
import openai
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from config import OPENAI_API_KEY

router = APIRouter()

openai_api_key = OPENAI_API_KEY

if not openai_api_key:
    raise ValueError("OPENAI_API_KEY not set.")

class TranslateRequest(BaseModel):
    word: str
    target_language: str

class TranslateResponse(BaseModel):
    translated_word: str

@router.post("/translate", response_model=TranslateResponse)
async def translate(req: TranslateRequest):
    try:
        print(f"Translating '{req.word}' to {req.target_language}...")
        # Ask OpenAI to translate the word
        response = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": f"You are a translator. Translate the user’s word into {req.target_language}. Reply with only the answer."},
                {"role": "user", "content": req.word}
            ],
            max_tokens=60,
            temperature=0.0,
        )
        translated = response.choices[0].message.content.strip()
        print(f"Translation result: {translated}")
        return TranslateResponse(translated_word=translated)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=502, detail=f"OpenAI API error: {e}")