import fitz
from docx import Document
from fastapi import UploadFile
from app.services.groq_service import client

async def analyze_resume(file: UploadFile):

    filename = file.filename.lower()

    text = ""

    if filename.endswith(".pdf"):

        pdf = fitz.open(stream=await file.read(), filetype="pdf")

        for page in pdf:
            text += page.get_text()

    elif filename.endswith(".docx"):

        contents = await file.read()

        with open("temp.docx", "wb") as f:
            f.write(contents)

        doc = Document("temp.docx")

        for para in doc.paragraphs:
            text += para.text + "\n"

    else:
        return "Unsupported file type."

    prompt = f"""
You are an expert ATS Resume Reviewer.

Analyze this resume.

{text}

Generate a professional report in markdown.

Include:

# ATS Score

# Skills Found

# Missing Skills

# Career Recommendation

# Resume Strengths

# Weaknesses

# Suggested Projects

# Certifications

# Suitable Companies

# Final Suggestions
"""

    chat = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return chat.choices[0].message.content