from fastapi import APIRouter, UploadFile, File
from app.services.resume_service import analyze_resume

router = APIRouter()

@router.post("/resume")
async def upload_resume(file: UploadFile = File(...)):
    result = await analyze_resume(file)
    return {"analysis": result}