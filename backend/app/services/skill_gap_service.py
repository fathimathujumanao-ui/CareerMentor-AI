from app.services.groq_service import client

def analyze_skill_gap(resume_text, target_job):

    prompt = f"""
You are an expert AI Career Mentor.

Resume:

{resume_text}

Target Job:

{target_job}

Generate a professional report in markdown.

Include:

# Current Skills

# Missing Skills

# Recommended Courses

# Suggested Projects

# Learning Roadmap

# Interview Preparation

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