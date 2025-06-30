import React, { useState } from "react";
import { GoPerson } from "react-icons/go";
import { Sparkles } from "lucide-react";
import "./PersonalInformation.css";

const PersonalInformation = () => {
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      name: "",
      email: "",
      phone: "",
      location: "",
      summary: "",
      summary_type: "notapplicable",
      industry: "",
    },
  });

  const [loadingRandom, setLoadingRandom] = useState(false);
  

  const handleGenerateRandomSummary = async () => {
    setLoadingRandom(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/random-summary`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to generate random summary: ${errorText}`);
      }
      const data = await response.json();

      setResumeData((prev) => ({
        ...prev,
        personalInfo: { ...prev.personalInfo, summary: data.randomsummary },
      }));
    } catch (error) {
      console.error("API error:", error);
      alert("Error generating random summary. Please try again.");
    } finally {
      setLoadingRandom(false);
    }
  };

  const { name, email, phone, location, summary, summary_type, industry } = resumeData.personalInfo;

  return (
    <div className="personal-info-container">
      <div className="header">
        <h2 className="title">
          <GoPerson size={20} />
          Personal Information
        </h2>
      </div>

      <div className="input-grid">
        <div className="input-pair">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) =>
              setResumeData((prev) => ({
                ...prev,
                personalInfo: { ...prev.personalInfo, name: e.target.value },
              }))
            }
            className="input-field"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setResumeData((prev) => ({
                ...prev,
                personalInfo: { ...prev.personalInfo, email: e.target.value },
              }))
            }
            className="input-field"
          />
        </div>

        <div className="input-pair">
          <input
            type="tel"
            placeholder="Phone"
            value={phone}
            onChange={(e) =>
              setResumeData((prev) => ({
                ...prev,
                personalInfo: { ...prev.personalInfo, phone: e.target.value },
              }))
            }
            className="input-field"
          />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) =>
              setResumeData((prev) => ({
                ...prev,
                personalInfo: { ...prev.personalInfo, location: e.target.value },
              }))
            }
            className="input-field"
          />
        </div>
      </div>

      <div className="options-row">
        <select
          value={summary_type}
          onChange={(e) =>
            setResumeData((prev) => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, summary_type: e.target.value },
            }))
          }
          className="dropdown"
        >
          <option value="notapplicable">Not Applicable</option>
          <option value="professional">Professional</option>
          <option value="creative">Creative</option>
          <option value="technical">Technical</option>
          <option value="executive">Executive</option>
          <option value="entry-level">Entry-Level</option>
        </select>

        <input
          type="text"
          placeholder="Industry (e.g. Software Engineering)"
          value={industry}
          onChange={(e) =>
            setResumeData((prev) => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, industry: e.target.value },
            }))
          }
          className="input-field"
        />
      </div>

      <div className="button-row">
        <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
          <button
            onClick={handleGenerateRandomSummary}
            disabled={loadingRandom}
            className="generate-button"
          >
            <Sparkles size={14} />
            {loadingRandom ? "Generating..." : "Generate With AI"}
          </button>
        </div>

        <textarea
          placeholder="Professional Summary"
          value={summary}
          onChange={(e) =>
            setResumeData((prev) => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, summary: e.target.value },
            }))
          }
          rows={4}
          className="textarea-field"
        />
      </div>
    </div>
  );
};

export default PersonalInformation;
