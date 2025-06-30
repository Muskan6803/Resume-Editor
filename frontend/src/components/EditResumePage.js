import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './EditResumePage.css';
import { Download, ArrowLeft } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import htmlDocx from 'html-docx-js/dist/html-docx';

const EditResumePage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const resumeContent = location.state?.resumeContent || '<p>No content provided.</p>';
  const fileName = location.state?.fileName?.replace(/\.[^/.]+$/, '') || 'resume';
  const [content, setContent] = useState(resumeContent);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const handleDownloadPDF = () => {
    const element = document.createElement('div');
    element.innerHTML = content;
    html2pdf().from(element).set({
      margin: 10,
      filename: `${fileName}.pdf`,
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }).save();
    setShowDropdown(false);
  };

  const handleDownloadDOCX = () => {
    const docxBlob = htmlDocx.asBlob(content);
    const url = URL.createObjectURL(docxBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.docx`;
    a.click();
    URL.revokeObjectURL(url);
    setShowDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const goBackHome = () => {
    navigate('/'); 
  };

  return (
    <div className="editor-container">
      <ReactQuill
        value={content}
        onChange={setContent}
        theme="snow"
        className="resume-quill-editor"
        modules={{
          toolbar: [
            [{ font: [] }, { size: [] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'],
            [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
            ['link', 'image'],
            ['clean']
          ],
        }}
        formats={[
          'font', 'size', 'header',
          'bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block',
          'list', 'bullet', 'indent',
          'link', 'image'
        ]}
      />

      <div className="editor-buttons" style={{ justifyContent: 'space-between' }}>
        <button className="back-button" onClick={goBackHome}>
          <ArrowLeft size={16} /> Back to Home
        </button>

        <div className="dropdown-container" style={{ position: 'relative' }}>
          <button
            ref={buttonRef}
            className="download-button"
            onClick={() => setShowDropdown(prev => !prev)}
          >
            <Download size={16} /> Download Resume
          </button>
          {showDropdown && (
            <div className="download-dropdown" ref={dropdownRef}>
              <div onClick={handleDownloadPDF}>📄 Download as PDF</div>
              <div onClick={handleDownloadDOCX}>📄 Download as DOCX</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditResumePage;
