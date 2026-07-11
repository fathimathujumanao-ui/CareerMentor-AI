from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.career import router
from app.api.resume import router as resume_router
from app.api.skill_gap import router as skill_gap_router
from app.api.interview import router as interview_router
from app.api.pdf import router as pdf_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
app.include_router(resume_router)
app.include_router(skill_gap_router)
app.include_router(interview_router)
app.include_router(pdf_router)

@app.get("/")
def root():
    return {"message": "Welcome to CareerMentor AI 🚀"}