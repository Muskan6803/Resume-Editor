import React, { useState } from 'react';
import PersonalInformation from './PersonalInformation';
import Experience from './Experience';
import Education from './Education';
import Skill from './Skills';
import Projects from './Projects';
import Navbar from './Navbar';
import './BlankResume.css';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FaFileImport } from "react-icons/fa";


function BlankResume() {
  const [educationData, setEducationData] = useState([]);
  const [experienceData, setExperienceData] = useState([]);
  const navigate = useNavigate();

  const goBackHome = () => {
    navigate('/');
  };

  const extractTextResume = () => {
    const section = document.getElementById("resume-content");
    if (!section) return "";

    let textResume = "";

    // --- PERSONAL INFORMATION ---
    textResume += `--- PERSONAL INFORMATION ---\n`;
    const personalInfo = section.querySelector(".personal-info-container");
    if (personalInfo) {
      const fields = personalInfo.querySelectorAll("input, textarea");
      fields.forEach(field => {
        const placeholder = field.getAttribute("placeholder") || "";
        const value = field.value.trim();
        if (value) {
          textResume += `${placeholder}: ${value}\n`;
        }
      });
    }

    // --- EXPERIENCE ---
    if (experienceData.length > 0) {
      textResume += `\n--- EXPERIENCE ---\n`;
      experienceData.forEach((exp, index) => {
        textResume += `\nExperience ${index + 1}:\n`;
        if (exp.jobTitle) textResume += `Job Title: ${exp.jobTitle}\n`;
        if (exp.company) textResume += `Company: ${exp.company}\n`;
        if (exp.city || exp.state || exp.country)
          textResume += `Location: ${exp.city}, ${exp.state}, ${exp.country}\n`;
        if (exp.startDate || exp.endDate)
          textResume += `Duration: ${exp.startDate?.slice(0, 10)} to ${exp.endDate?.slice(0, 10)}\n`;
        if (exp.jobDescription) textResume += `Description: ${exp.jobDescription}\n`;
      });
    }


    // --- EDUCATION ---
    if (educationData.length > 0) {
      textResume += `\n--- EDUCATION ---\n`;
      educationData.forEach((edu, index) => {
        textResume += `\nEducation ${index + 1}:\n`;
        if (edu.degree) textResume += `Degree: ${edu.degree}\n`;
        if (edu.course) textResume += `Course: ${edu.course}\n`;
        if (edu.college) textResume += `College: ${edu.college}\n`;
        if (edu.gpa) textResume += `GPA: ${edu.gpa}\n`;
        if (edu.city || edu.state || edu.country)
          textResume += `Location: ${edu.city}, ${edu.state}, ${edu.country}\n`;
        if (edu.startDate || edu.endDate)
          textResume += `Duration: ${edu.startDate?.slice(0, 10)} to ${edu.endDate?.slice(0, 10)}\n`;
      });
    }

    // --- PROJECTS ---
    const projects = section.querySelectorAll(".inside-group");
    if (projects.length > 0) {
      textResume += `\n--- PROJECTS ---\n`;
      projects.forEach((project, index) => {
        const title = project.querySelector("input[placeholder='Project Title']")?.value.trim();
        const tech = project.querySelector("input[placeholder='Technologies']")?.value.trim();
        const role = project.querySelector("input[placeholder='Role']")?.value.trim();
        const desc = project.querySelector("textarea")?.value.trim();

        textResume += `\nProject ${index + 1}:\n`;
        if (title) textResume += `Title: ${title}\n`;
        if (tech) textResume += `Technologies: ${tech}\n`;
        if (role) textResume += `Role: ${role}\n`;
        if (desc) textResume += `Description: ${desc}\n`;
      });
    }

    // --- SKILLS ---
    const skillSection = section.querySelector(".skill-container");
    if (skillSection) {
      const skillInputs = skillSection.querySelectorAll(".skill-item input");
      const skillList = [];
      skillInputs.forEach(input => {
        const value = input.value.trim();
        if (value) skillList.push(value);
      });
      if (skillList.length > 0) {
        textResume += `\n--- SKILLS ---\n`;
        textResume += `Skills: ${skillList.join(", ")}\n`;
      }
    }

    return textResume;
  };

  const handleSaveAndView = () => {
    const textContent = extractTextResume();
    const newWindow = window.open('', '_blank');

    newWindow.document.write(`
    <html>
      <head>
        <title>Text Resume</title>
        <style>
          html, body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            line-height: 1.6;
            overflow-x: hidden;
            box-sizing: border-box;
          }
          h1 {
            text-align: center;
            margin: 20px 0 10px;
            text-transform: uppercase;
          }
          .dropdown-container {
            position: relative;
            margin: 10px 20px;
          }
          .download-button {
            background-color:rgb(12, 12, 12);
            color: white;
            padding: 10px 16px;
            border-radius: 8px;
            border: none;
            font-size: 14px;
            cursor: pointer;
          }
          .download-dropdown {
            position: absolute;
            top: 110%;
            left: 0;
            background: white;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
            min-width: 160px;
            z-index: 9999;
          }
          .download-dropdown div {
            padding: 8px 12px;
            cursor: pointer;
            font-size: 14px;
            border-bottom: 1px solid #eee;
          }
          .download-dropdown div:last-child {
            border-bottom: none;
          }
          pre {
            font-size: 16px;
            white-space: pre-wrap;
            word-break: break-word;
            overflow-wrap: break-word;
            padding: 20px;
            margin: 0;
            max-width: 100vw;
            box-sizing: border-box;
          }
            .dropdown-container {
            position: absolute;
            top: 20px;
            right: 20px;
            z-index: 9999;
          }

        </style>
      </head>
      <body>
        <h1>Resume</h1>
        <div class="dropdown-container">
          <button class="download-button" onclick="toggleDropdown()">⬇ Download Resume</button>
          <div class="download-dropdown" id="dropdown" style="display: none;">
            <div onclick="downloadText()">📄 Download as Text</div>
            <div onclick="downloadPDF()">📄 Download as PDF</div>
            <div onclick="downloadDOCX()">📄 Download as DOCX</div>
          </div>
        </div>

        <pre id="resumeText">${textContent}</pre>

        <script>
  function toggleDropdown() {
    const dropdown = document.getElementById("dropdown");
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
  }

  document.addEventListener("click", function (event) {
    const dropdown = document.getElementById("dropdown");
    const button = document.querySelector(".download-button");
    if (!dropdown || !button) return;

    if (
      dropdown.style.display === "block" &&
      !dropdown.contains(event.target) &&
      !button.contains(event.target)
    ) {
      dropdown.style.display = "none";
    }
  });

  function downloadText() {
    const text = document.getElementById("resumeText").innerText;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume.txt';
    a.click();
    URL.revokeObjectURL(url);
  }

  function downloadPDF() {
    const element = document.createElement('div');
    element.innerHTML = "<pre>" + document.getElementById("resumeText").innerText + "</pre>";
    window.html2pdf().from(element).set({
      margin: 10,
      filename: "resume.pdf",
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    }).save();
  }

  function downloadDOCX() {
    const text = document.getElementById("resumeText").innerText;
    const html = "<html><body><pre>" + text + "</pre></body></html>";
    const converted = window.htmlDocx.asBlob(html);
    const url = URL.createObjectURL(converted);
    const a = document.createElement('a');
    a.href = url;
    a.download = "resume.docx";
    a.click();
    URL.revokeObjectURL(url);
  }
</script>


        <!-- Import libraries -->
        <script src="https://unpkg.com/html-docx-js/dist/html-docx.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.2/html2pdf.bundle.min.js"></script>
      </body>
    </html>
  `);

    newWindow.document.close();
  };

  return (
    <div>
      <div className='blank-resume'>
        <Navbar />
        <div id="resume-content">
          <PersonalInformation />
          <Experience setExperienceData={setExperienceData} />
          <Education setEducationData={setEducationData} />
          <Projects />
          <Skill />

        </div>
      </div>

      <div className="editor-buttons" style={{ display: 'flex', justifyContent: 'space-between', margin: '20px' }}>
        <button className="back-button" onClick={goBackHome}>
          <ArrowLeft size={16} /> Back to Home
        </button>

        <button className="view-text-button" onClick={handleSaveAndView}>
          <FaFileImport size={18} />
          View Text File
        </button>
      </div>
    </div>
  );
}

export default BlankResume;
