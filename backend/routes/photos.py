import io
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from appwrite_client.client import storage, databases, BUCKET_ID, DB_ID, COLLECTION_ID
from appwrite.input_file import InputFile

import uuid
import traceback

router = APIRouter()

@router.post("/upload-flashcard")
async def upload_flashcard(
    userId: str = Form(...),
    sentences: str = Form(...),
    baseWord: str = Form(...),
    translatedWord: str = Form(...),
    file: UploadFile = File(...),
    deckName: str = Form(...)
):
    try:
        # 1) Benzersiz file ID oluştur
        file_id = uuid.uuid4().hex
        print("file id created")
        # 2) Fotoğrafı oku
        file_bytes = await file.read()
        print("file read")

        input_file = InputFile.from_bytes(
            file_bytes,
            filename=file.filename,
            mime_type=file.content_type
        )
        # 3) Appwrite Storage’a yükle
        storage.create_file(
            bucket_id=BUCKET_ID,
            file_id=file_id,
            file=input_file,
        )
        print("Storage done")
        # 4) Appwrite Database’e belge ekle
        document = databases.create_document(
            database_id=DB_ID,
            collection_id=COLLECTION_ID,
            document_id="unique()",
            data={
                "photoId": file_id,
                "baseWord": baseWord,
                "translatedWord": translatedWord,
                "sentences": sentences,
                "userId": userId,
                "deckName": deckName
            }
        )

        return {
            "message": "Flashcard uploaded successfully",
            "document_id": document["$id"],
            "photo_id": file_id
        }

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/ping")
def ping():
    return {"message": "API is alive"}