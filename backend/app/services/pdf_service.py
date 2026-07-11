import os
from datetime import datetime

from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    PageBreak,
)


def generate_pdf(career, resume, skill_gap, interview):

    os.makedirs("app/reports", exist_ok=True)

    filepath = "app/reports/CareerMentor_Report.pdf"

    doc = SimpleDocTemplate(filepath)

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        "Title",
        parent=styles["Title"],
        alignment=TA_CENTER,
        textColor=HexColor("#0B5ED7"),
        fontSize=24,
        spaceAfter=20,
    )

    heading_style = ParagraphStyle(
        "Heading",
        parent=styles["Heading1"],
        textColor=HexColor("#0B5ED7"),
        spaceAfter=10,
    )

    body_style = styles["BodyText"]

    story = []

    story.append(Paragraph("CareerMentor AI", title_style))
    story.append(
        Paragraph(
            "Professional Career Guidance Report",
            styles["Heading2"],
        )
    )

    story.append(
        Paragraph(
            datetime.now().strftime("Generated on: %d %B %Y"),
            styles["Normal"],
        )
    )

    story.append(Spacer(1, 30))

    sections = [
        ("Career Recommendation", career),
        ("Resume Analysis", resume),
        ("Skill Gap Analysis", skill_gap),
        ("Interview Preparation", interview),
    ]

    for title, content in sections:

        story.append(Paragraph(title, heading_style))
        story.append(Spacer(1, 10))

        for line in content.split("\n"):

            line = line.strip()

            if not line:
                continue

            if line.startswith("#"):

                story.append(
                    Paragraph(
                        f"<b>{line.replace('#','').strip()}</b>",
                        styles["Heading2"],
                    )
                )

            elif line.startswith("-"):

                story.append(
                    Paragraph(
                        f"• {line[1:].strip()}",
                        body_style,
                    )
                )

            else:

                story.append(
                    Paragraph(line, body_style)
                )

        story.append(PageBreak())

    doc.build(story)

    return filepath