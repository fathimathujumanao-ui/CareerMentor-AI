from fastapi import APIRouter
from pydantic import BaseModel
from app.services.skill_gap_service import analyze_skill_gap

router = APIRouter()

class SkillGapRequest(BaseModel):
    resume_text: str
    target_job: str

@router.post("/skill-gap")
def skill_gap(data: SkillGapRequest):
    result = analyze_skill_gap(
        data.resume_text,
        data.target_job
    )

    return {"analysis": result}