import os
import openai
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

# add api key

class GenerateRequest(BaseModel):
    word: str
    interest: Optional[str] = ""
    count: Optional[int] = 3
    language: Optional[str] = "Turkish"
    level: Optional[str] = "A2-B1"

class GenerateResponse(BaseModel):
    sentences: List[str]

def generate_personalized_sentences(
    word: str,
    interest: str,
    language: str,
    count: int,
    level: str
) -> List[str]:
    messages = [
        {
            "role": "system",
            "content": (
                f"You are an AI assistant for a language-learning app. "
                f"Generate {count} short, natural example sentences in {language} "
                f"at {level} level. Use the target word once per sentence and make them relevant to the user's interest."
            )
        },
        {
            "role": "user",
            "content": f"Target word: \"{word}\"\nUser interest: \"{interest}\"\nGenerate {count} sentences."
        }
    ]

    resp = openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        max_tokens=150,
        n=1,
        temperature=0.6,
    )
    text = resp.choices[0].message.content.strip()
    # split on newlines into individual sentences
    lines = [line.strip() for line in text.split("\n") if line.strip()]
    return lines[:count]

@router.post("/generate-sentences", response_model=GenerateResponse)
async def generate_sentences(req: GenerateRequest):
    try:
        sentences = generate_personalized_sentences(
            word=req.word,
            interest=req.interest or "",
            language=req.language,
            count=req.count,
            level=req.level,
        )
        print(sentences)
        return GenerateResponse(sentences=sentences)
    except Exception as e:
        # if anything goes wrong with OpenAI, return a 502
        raise HTTPException(status_code=502, detail=f"OpenAI API error: {e}")
