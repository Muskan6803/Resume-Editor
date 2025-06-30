from fastapi import FastAPI, HTTPException, Query, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import io
import pdfplumber
import docx
import requests
import docx2txt
import PyPDF2


load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL_NAME = "llama3-8b-8192"

# ------------------- Utility: Call GROQ -------------------
def call_groq_api(prompt: str, max_tokens: int = 200, temperature: float = 0.8) -> str:
    if not GROQ_API_KEY:
        raise HTTPException(status_code=500, detail="GROQ_API_KEY not configured")

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": GROQ_MODEL_NAME,
        "messages": [
            {"role": "system", "content": "You are an expert resume writer and career counselor with 15+ years of experience."},
            {"role": "user", "content": prompt},
        ],
        "max_tokens": max_tokens,
        "temperature": temperature,
        "top_p": 0.9,
    }

    response = requests.post(GROQ_API_URL, headers=headers, json=payload)
    response.raise_for_status()
    data = response.json()
    return data["choices"][0]["message"]["content"].strip()

# ------------------- Endpoint: Random Summary -------------------
@app.get("/random-summary")
async def random_summary():
    prompt = """
    Generate a completely new, creative, and compelling professional summary for a software engineer.
    Make it unique and impactful. Use action verbs and quantifiable achievements.
    Keep it between 3-4 sentences.
    """
    summary = call_groq_api(prompt, temperature=0.9)
    return {"randomsummary": summary}

# ------------------- Endpoint: Random Job Description -------------------
class JobDescriptionRequest(BaseModel):
    job_title: str
    company: str
    industry: str = "Software Engineering"

@app.post("/random-job-description")
async def generate_random_job_description(job: JobDescriptionRequest):
    prompt = f"""
    Write a job description for a {job.job_title} at {job.company} in the {job.industry} field.
    Focus on key responsibilities, tech used, challenges solved, and accomplishments.
    Do not begin with “Here’s a job description”. Keep it unique and professional.
    """
    description = call_groq_api(prompt, temperature=0.9)
    return {"randomJobDescription": description}

# ------------------- Endpoint: Random Project Description -------------------
class ProjectDescriptionRequest(BaseModel):
    title: str = "Resume Editor",
    technologies: list[str] = []
    role: str = ""

@app.post("/random-description")
async def generate_project_description(project: ProjectDescriptionRequest):
    tech_stack = ", ".join(project.technologies) if project.technologies else "various technologies"
    role_text = f" as a {project.role}" if project.role else ""
    
    prompt = f"""
    Write a unique and detailed project description for a project titled "{project.title}"{role_text}. The project uses {tech_stack}.
    Focus on what the project does, how it was built, challenges overcome, and key contributions.
    Do not say “Here’s a project description”. Make it sound like it belongs on a professional resume.
    """
    
    description = call_groq_api(prompt, temperature=0.8)
    return {"randomdescription": description}

# ------------------- Endpoint: Upload Resume & Extract Text -------------------
@app.post("/extract-resume")
async def extract_resume(file: UploadFile = File(...)):
    if file.content_type not in ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]:
        raise HTTPException(status_code=400, detail="Unsupported file type")

    contents = await file.read()
    content_text = ""

    try:
        if file.filename.endswith(".pdf"):
            with pdfplumber.open(io.BytesIO(contents)) as pdf:
                content_text = "\n".join(page.extract_text() or "" for page in pdf.pages)
        elif file.filename.endswith(".docx"):
            content_text = docx2txt.process(io.BytesIO(contents))
        else:
            raise HTTPException(status_code=400, detail="Unsupported file extension")

        if not content_text.strip():
            content_text = "(No extractable text found)"

        return {"content": content_text.strip()}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to extract content: {str(e)}")