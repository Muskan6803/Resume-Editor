import React, { useState, useEffect, useRef } from "react";
import { FiSave } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const [saveStatus, setSaveStatus] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

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

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSaveClick = () => {
    setIsSaving(true);
    setSaveStatus("saving");

    setTimeout(() => {
      setSaveStatus("success");
      setIsSaving(false);
      setTimeout(() => setSaveStatus(""), 2000);
    }, 1500);
  };

  const getResumeContent = () => {
    const resumeElement = document.getElementById("resume-content");
    return resumeElement ? resumeElement.innerHTML : "<p>No content found</p>";
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        <h2 className="navbar-title">Resume Editor</h2>
        {saveStatus === "saving" && <p className="save-message saving">Saving...</p>}
        {saveStatus === "success" && <p className="save-message success">Resume saved successfully!</p>}
      </div>

      <div className="button-group">
        <button
          onClick={handleSaveClick}
          className={`btn btn-green ${isSaving ? 'disabled' : ''}`}
          disabled={isSaving}
        >
          <FiSave />
          <span>{isSaving ? "Saving..." : "Save Resume"}</span>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
