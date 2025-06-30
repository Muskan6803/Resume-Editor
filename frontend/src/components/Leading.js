// src/components/Leading.js
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload } from 'lucide-react';
import './Leading.css';

const ResumeUploadUI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  const extractResumeContent = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("http://localhost:8000/extract-resume", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    return `<p>${data.content.replace(/\n/g, "<br>")}</p>`;
  };


  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!validTypes.includes(file.type)) {
      showNotification('Please upload a PDF or DOCX file');
      return;
    }

    setIsLoading(true);
    try {
      const resumeContent = await extractResumeContent(file);
      navigate('/edit-resume', {
        state: {
          resumeContent,
          fileName: file.name
        }
      });
    } catch (error) {
      showNotification('Error uploading file');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartBlank = () => {
    navigate('/blank-resume');
  };

  return (
    <div className="resume-upload-page">
      {notification && <div className="resume-notification">{notification}</div>}

      <div className="resume-wrapper">
        <header className="resume-header">
          <h1 className="resume-title">Resume Editor</h1>
          <p className="resume-subtitle">Upload your resume or start from scratch</p>
        </header>

        <div className="resume-upload-card">
          <div className="resume-upload-content">
            <div className="resume-upload-icon">
              <Upload className="resume-upload-svg" strokeWidth={2} />
            </div>

            <h2 className="resume-upload-heading">Upload Resume</h2>
            <p className="resume-upload-subheading">Upload a PDF or DOCX file to get started</p>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".pdf,.docx"
              className="resume-file-input"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="resume-upload-button"
            >
              {isLoading ? (
                <>
                  <div className="resume-loader"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="resume-button-icon" />
                  Choose File
                </>
              )}
            </button>

            <div className="resume-divider">
              <div className="resume-divider-line"></div>
            </div>

            <button onClick={handleStartBlank} className="resume-start-blank">
              Or start with a blank resume
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeUploadUI;
