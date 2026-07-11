from fastapi import APIRouter
from pydantic import BaseModel
from app.services.interview_service import generate_interview

router = APIRouter()

class InterviewRequest(BaseModel):
    target_job: str

@router.post("/interview")
def interview(data: InterviewRequest):
    result = generate_interview(data.target_job)
    return {"questions": result}