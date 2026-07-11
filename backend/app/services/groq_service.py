import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def get_career_advice(skills, interests):

    prompt = f"""
You are an expert AI Career Mentor.

Student Skills:
{skills}

Student Interests:
{interests}

Generate a professional report with:

1. Best Career Path
2. Why this career suits the student
3. Skills to Learn
4. Certifications
5. Best Projects
6. Companies Hiring
7. Expected Salary (India)
8. 6-Month Roadmap
9. Final Motivation

Return in beautiful markdown.
"""

    stream = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        stream=True
    )

    return stream