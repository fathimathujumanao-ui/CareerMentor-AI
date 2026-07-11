from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from app.services.groq_service import get_career_advice

router = APIRouter()

class CareerRequest(BaseModel):
    skills: str
    interests: str


def generate(data):
    stream = get_career_advice(data.skills, data.interests)

    for chunk in stream:
        if chunk.choices[0].delta.content is not None:
            yield chunk.choices[0].delta.content


@router.post("/career")
def career(data: CareerRequest):
    return StreamingResponse(
        generate(data),
        media_type="text/plain"
    )