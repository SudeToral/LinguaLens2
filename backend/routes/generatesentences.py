import os
import openai
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from config import OPENAI_API_KEY

router = APIRouter()


openai_api_key = OPENAI_API_KEY

if not openai_api_key:
    raise ValueError("OPENAI_API_KEY not set.")

class GenerateRequest(BaseModel):
    word: str
    interest: Optional[str] = ""
    count: Optional[int] = 3
    language: Optional[str] = ""
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
                f"Generate {count} short, natural example sentences in {language}. "
                f"Make sure everything you produce is in  {language} - do not use any other language. "
                f"Generate the sentences at {level} level. "
                f"Use the target word \"{word}\" exactly once per sentence, "
                f"and make each example relevant to the user's interest: \"{interest}\"."
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
        print("Generating sentences for interests:", req.interest)
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