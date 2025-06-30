# 📝 Resume Editor - Full Stack App

A full-stack resume editing application built with **React.js** (frontend) and **FastAPI** (backend). It allows users to:
- Upload a resume file
- Edit content like name, experience, education, and skills
- Enhance each section with AI
- Save and download the final resume as JSON

---

## 📁 Project Structure

resume-editor/
├── frontend/ # React application
└── backend/ # FastAPI application

yaml
Copy
Edit

---

## 🚀 Features

### ✅ Frontend (React.js)
- Upload `.pdf` or `.docx` resume files (mock parsed with dummy data)
- Edit resume fields: Name, Experience, Education, Skills
- Add or remove entries in each section
- "Enhance with AI" button per section → sends data to backend `/ai-enhance` and displays enhanced content
- "Save Resume" → sends complete resume to backend `/save-resume`
- "Download Resume" → downloads resume as `.json`

### ✅ Backend (FastAPI)
- `POST /ai-enhance`: Returns a mocked improved version of a section
- `POST /save-resume`: Saves resume JSON to disk or memory

---

## 🔧 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/resume-editor.git
cd resume-editor
🖥️ Frontend Setup (React.js)
Prerequisites
Node.js v16+

npm or yarn

Installation
bash
Copy
Edit
cd frontend
npm install
Run the Frontend
bash
Copy
Edit
npm start
Frontend will run at: http://localhost:3000

⚙️ Backend Setup (FastAPI)
Prerequisites
Python 3.9+

pip (or poetry/pipenv)

Installation
bash
Copy
Edit
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
Run the Backend Server
bash
Copy
Edit
uvicorn main:app --reload
Backend will run at: http://localhost:8000

🧪 API Endpoints
POST /ai-enhance
Input:

json
Copy
Edit
{
  "section": "summary",
  "content": "Experienced developer..."
}
Output (mocked):

json
Copy
Edit
{
  "enhanced_content": "Experienced and results-driven software developer..."
}
POST /save-resume
Input: Entire resume JSON object

Behavior: Saves the resume (to disk or memory)

📄 Download Resume
A .json file of the final resume can be downloaded directly from the frontend.
