import os
import openai
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

# add api key

class TranslateRequest(BaseModel):
    word: str

class TranslateResponse(BaseModel):
    translated_word: str

@router.post("/translate", response_model=TranslateResponse)
async def translate(req: TranslateRequest):
    try:
        # Ask OpenAI to translate the word
        response = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a translator. Translate the user’s word into turkish. Reply with only the word."},
                {"role": "user", "content": req.word}
            ],
            max_tokens=60,
            temperature=0.0,
        )
        translated = response.choices[0].message.content.strip()
        return TranslateResponse(translated_word=translated)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=502, detail=f"OpenAI API error: {e}")
