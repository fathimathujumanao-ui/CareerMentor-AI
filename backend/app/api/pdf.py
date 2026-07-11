from fastapi import APIRouter
from fastapi.responses import FileResponse
from pydantic import BaseModel

from app.services.pdf_service import generate_pdf

router = APIRouter()

class PDFRequest(BaseModel):

    career: str
    resume: str
    skill_gap: str
    interview: str


@router.post("/download-pdf")
def download_pdf(data: PDFRequest):

    pdf = generate_pdf(
        data.career,
        data.resume,
        data.skill_gap,
        data.interview,
    )

    return FileResponse(
        pdf,
        filename="CareerMentor_Report.pdf",
        media_type="application/pdf",
    )