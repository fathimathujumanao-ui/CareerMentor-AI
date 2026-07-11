from app.services.groq_service import client

def generate_interview(target_job):

    prompt = f"""
You are an expert technical interviewer.

Target Job:
{target_job}

Generate a professional interview preparation guide in Markdown.

Include:

# HR Interview Questions (5)

# Technical Questions (10)

# Coding Questions (5)

# System Design Questions (3)

# Interview Tips

# Common Mistakes

# Final Advice
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