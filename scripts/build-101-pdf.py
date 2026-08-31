#!/usr/bin/env python3
"""Build illustrated PDFs from content/101/{en,ko}.md."""

from pathlib import Path
import re

from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    Image,
    KeepTogether,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
)
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.cidfonts import UnicodeCIDFont

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "content" / "101"
ASSETS = SRC / "assets"
OUT = ROOT / "public" / "101"

IMG = re.compile(r"^!\[([^\]]*)\]\(([^)]+)\)$")


def strip_frontmatter(raw: str) -> str:
    m = re.match(r"^---\n[\s\S]*?\n---\n([\s\S]*)$", raw)
    return m.group(1).strip() if m else raw


def html_escape(text: str) -> str:
    return text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def inline(text: str) -> str:
    text = html_escape(text)
    text = re.sub(r"`([^`]+)`", r"<font face='Courier'><font size='9'>\1</font></font>", text)
    text = re.sub(r"\*\*([^*]+)\*\*", r"<b>\1</b>", text)
    text = re.sub(r"\*([^*]+)\*", r"<i>\1</i>", text)
    text = re.sub(r"\[([^\]]+)\]\((https?:[^)]+|\/[^)]+)\)", r'<link href="\2" color="black"><u>\1</u></link>', text)
    return text


def resolve_img(src: str) -> Path | None:
    name = src.replace("assets/", "", 1) if src.startswith("assets/") else src
    path = ASSETS / name
    return path if path.is_file() else None


def cover(styles, lang: str):
    bits = []
    art = ASSETS / "cover-art.jpg"
    if art.is_file():
        img = Image(str(art), width=4.4 * inch, height=6.6 * inch)
        img.hAlign = "CENTER"
        bits.append(img)
        bits.append(Spacer(1, 18))
    title = "Grok Bot 101"
    sub = "Field bible" if lang == "en" else "현장 바이블"
    bits.append(Paragraph(title, styles["CoverTitle"]))
    bits.append(Spacer(1, 6))
    bits.append(Paragraph(sub, styles["CoverSub"]))
    bits.append(Spacer(1, 10))
    bits.append(Paragraph("getgrokbot.com", styles["CoverSub"]))
    bits.append(PageBreak())
    return bits


def toc(raw: str, styles, lang: str):
    bits = [
        Paragraph("Contents" if lang == "en" else "목차", styles["Heading1"]),
        Spacer(1, 8),
    ]
    for line in strip_frontmatter(raw).split("\n"):
        s = line.rstrip()
        if s.startswith("## "):
            bits.append(Paragraph(inline(s[3:]), styles["DocBody"]))
    bits.append(PageBreak())
    return bits


def story_from_md(raw: str, styles, lang: str):
    body = strip_frontmatter(raw)
    story = cover(styles, lang)
    story.extend(toc(raw, styles, lang))
    for line in body.split("\n"):
        s = line.rstrip()
        if not s:
            story.append(Spacer(1, 6))
            continue
        if s.strip() == "---":
            story.append(Spacer(1, 10))
            continue
        if s.startswith("# "):
            continue
        if s.startswith("## "):
            story.append(Spacer(1, 12))
            story.append(Paragraph(inline(s[3:]), styles["Heading1"]))
            story.append(Spacer(1, 6))
            continue
        if s.startswith("### "):
            story.append(Paragraph(inline(s[4:]), styles["Heading2"]))
            continue
        img = IMG.match(s.strip())
        if img:
            alt, src = img.group(1), img.group(2)
            if "cover-art" in src:
                continue
            path = resolve_img(src)
            if path:
                picture = Image(str(path))
                w, h = float(picture.imageWidth), float(picture.imageHeight)
                scale = min((6.0 * inch) / w, (5.2 * inch) / h)
                picture.drawWidth = w * scale
                picture.drawHeight = h * scale
                picture.hAlign = "CENTER"
                cap = Paragraph(f"<i>{html_escape(alt)}</i>", styles["DocSlot"])
                story.append(KeepTogether([picture, Spacer(1, 4), cap, Spacer(1, 12)]))
            else:
                story.append(Paragraph(f"<i>[Placeholder · {html_escape(alt)}]</i>", styles["DocSlot"]))
            continue
        if s.startswith("> "):
            story.append(Paragraph(inline(s[2:]), styles["DocQuote"]))
            continue
        if re.match(r"^[-*]\s+", s):
            story.append(Paragraph("• " + inline(re.sub(r"^[-*]\s+", "", s)), styles["DocBody"]))
            continue
        if re.match(r"^\d+\.\s+", s):
            story.append(Paragraph(inline(s), styles["DocBody"]))
            continue
        story.append(Paragraph(inline(s), styles["DocBody"]))
        story.append(Spacer(1, 3))
    return story


def page_number(canvas, doc):
    canvas.saveState()
    canvas.setFont("Times-Roman", 8)
    canvas.drawString(0.9 * inch, 0.45 * inch, "Grok Bot 101 · getgrokbot.com")
    canvas.drawRightString(letter[0] - 0.9 * inch, 0.45 * inch, str(doc.page))
    canvas.restoreState()


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
            spaceAfter=3,
        )
    )
    styles.add(
        ParagraphStyle(
            name="DocQuote",
            parent=styles["Normal"],
            fontName=body_font,
            fontSize=10,
            leading=14,
            leftIndent=12,
            textColor="#333333",
            spaceAfter=8,
            spaceBefore=4,
        )
    )
    styles.add(
        ParagraphStyle(
            name="CoverTitle",
            parent=styles["Title"],
            fontName=body_font,
            fontSize=28,
            leading=32,
            alignment=TA_CENTER,
            spaceAfter=0,
        )
    )
    styles.add(
        ParagraphStyle(
            name="CoverSub",
            parent=styles["Normal"],
            fontName=body_font,
            fontSize=11,
            leading=14,
            alignment=TA_CENTER,
        )
    )
    styles["Title"].fontName = body_font
    styles["Heading1"].fontName = body_font
    styles["Heading1"].fontSize = 14
    styles["Heading1"].leading = 18
    styles["Heading2"].fontName = body_font
    styles["Heading2"].fontSize = 11
    styles["Heading2"].leading = 14
    styles.add(ParagraphStyle(name="DocSlot", parent=styles["Normal"], fontName=body_font, fontSize=8, leading=11))
    OUT.mkdir(parents=True, exist_ok=True)
    path = OUT / f"{lang}.pdf"
    doc = SimpleDocTemplate(
        str(path),
        pagesize=letter,
        leftMargin=0.85 * inch,
        rightMargin=0.85 * inch,
        topMargin=0.7 * inch,
        bottomMargin=0.7 * inch,
        title=f"Grok Bot 101 ({lang})",
        author="getgrokbot.com",
    )
    raw = (SRC / f"{lang}.md").read_text(encoding="utf-8")
    doc.build(story_from_md(raw, styles, lang), onFirstPage=page_number, onLaterPages=page_number)
    print("wrote", path, "pages ~ see file")


if __name__ == "__main__":
    build("en")
    build("ko")
