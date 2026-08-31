#!/usr/bin/env python3
"""Build text PDFs from content/101/{en,ko}.md. Images are slots until assets exist."""

from pathlib import Path
import re

from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer
from reportlab.lib.enums import TA_LEFT
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.cidfonts import UnicodeCIDFont

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "content" / "101"
OUT = ROOT / "public" / "101"


def strip_frontmatter(raw: str) -> str:
    m = re.match(r"^---\n[\s\S]*?\n---\n([\s\S]*)$", raw)
    return m.group(1).strip() if m else raw


def html_escape(text: str) -> str:
    return (
        text.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
    )


def inline(text: str) -> str:
    text = html_escape(text)
    text = re.sub(r"`([^`]+)`", r"<font face='Courier'><font size='9'>\1</font></font>", text)
    text = re.sub(r"\*\*([^*]+)\*\*", r"<b>\1</b>", text)
    text = re.sub(r"\[([^\]]+)\]\((https?:[^)]+|\/[^)]+)\)", r'<link href="\2">\1</link>', text)
    return text


def story_from_md(raw: str, styles):
    body = strip_frontmatter(raw)
    story = []
    for line in body.split("\n"):
        s = line.rstrip()
        if not s:
            story.append(Spacer(1, 8))
            continue
        if s.strip() == "---":
            story.append(Spacer(1, 12))
            continue
        if s.startswith("# "):
            story.append(Paragraph(inline(s[2:]), styles["Title"]))
            story.append(Spacer(1, 12))
            continue
        if s.startswith("## "):
            story.append(Spacer(1, 10))
            story.append(Paragraph(inline(s[3:]), styles["Heading1"]))
            continue
        if s.startswith("### "):
            story.append(Paragraph(inline(s[4:]), styles["Heading2"]))
            continue
        if s.startswith("!["):
            alt = re.match(r"!\[([^\]]*)\]", s)
            label = alt.group(1) if alt else "image"
            story.append(Paragraph(f"<i>[Image slot: {html_escape(label)}]</i>", styles["DocSlot"]))
            continue
        if s.startswith("> "):
            story.append(Paragraph(inline(s[2:]), styles["DocSlot"]))
            continue
        if re.match(r"^[-*]\s+", s):
            story.append(Paragraph("• " + inline(re.sub(r"^[-*]\s+", "", s)), styles["DocBody"]))
            continue
        if re.match(r"^\d+\.\s+", s):
            story.append(Paragraph(inline(s), styles["DocBody"]))
            continue
        story.append(Paragraph(inline(s), styles["DocBody"]))
        story.append(Spacer(1, 4))
    return story


def build(lang: str):
    if lang == "ko":
        pdfmetrics.registerFont(UnicodeCIDFont("HYSMyeongJo-Medium"))
        body_font = "HYSMyeongJo-Medium"
    else:
        body_font = "Times-Roman"
    styles = getSampleStyleSheet()
    styles.add(
        ParagraphStyle(
            name="DocBody",
            parent=styles["Normal"],
            fontName=body_font,
            fontSize=10,
            leading=14,
            alignment=TA_LEFT,
            spaceAfter=2,
        )
    )
    styles["Title"].fontName = body_font
    styles["Heading1"].fontName = body_font
    styles["Heading2"].fontName = body_font
    slot = ParagraphStyle(name="DocSlot", parent=styles["Normal"], fontName=body_font, fontSize=9, leading=12)
    styles.add(slot)
    OUT.mkdir(parents=True, exist_ok=True)
    path = OUT / f"{lang}.pdf"
    doc = SimpleDocTemplate(
        str(path),
        pagesize=letter,
        leftMargin=0.9 * inch,
        rightMargin=0.9 * inch,
        topMargin=0.8 * inch,
        bottomMargin=0.8 * inch,
        title=f"Grok Bot 101 ({lang})",
        author="getgrokbot.com",
    )
    raw = (SRC / f"{lang}.md").read_text(encoding="utf-8")
    doc.build(story_from_md(raw, styles))
    print("wrote", path)


if __name__ == "__main__":
    build("en")
    build("ko")
