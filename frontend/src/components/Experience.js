import React, { useState, useEffect } from "react";
import { MdOutlineWorkHistory } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Sparkles } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Experience.css";

function Experience({setExperienceData}) {
  const [experiences, setExperiences] = useState([
    {
      id: 1,
      jobTitle: "",
      company: "",
      state: "",
      city: "",
      country: "",
      startDate: '',
      endDate: '',
      jobDescription: "",
    },
  ]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [loadingIndex, setLoadingIndex] = useState(null);

const addExperience = () => {
    setExperiences([
      ...experiences,
      {
        id: experiences.length + 1,
        jobTitle: "",
        company: "",
        state: "",
        city: "",
        country: "",
        startDate: null,
        endDate: null,
        jobDescription: "",
      },
    ]);
  };

  const deleteExperience = (index) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  useEffect(() => {
          setExperienceData(experiences);
      }, [experiences]);

  useEffect(() => {
    const fetchCountries = async () => {
      const response = await fetch("https://countriesnow.space/api/v0.1/countries/positions");
      const data = await response.json();
      const countryList = data.data.map(item => item.name).sort();
      setCountries(countryList);
    };
    fetchCountries();
  }, []);

  const handleCountryChange = async (value, index) => {
    const updated = [...experiences];
    updated[index].country = value;
    updated[index].state = '';
    updated[index].city = '';
    setExperiences(updated);

    setStates([]);
    setCities([]);

    try {
      const res = await fetch("https://countriesnow.space/api/v0.1/countries/states", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: value }),
      });
      const json = await res.json();
      const stateList = json.data.states.map(s => s.name);
      setStates(stateList);
    } catch (err) {
      console.error("Error fetching states:", err);
    }
  };

  const handleStateChange = async (value, index) => {
    const updated = [...experiences];
    updated[index].state = value;
    updated[index].city = '';
    setExperiences(updated);
    

    try {
      const res = await fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: updated[index].country, state: value }),
      });
      const json = await res.json();
      setCities(json.data);
    } catch (err) {
      console.error("Error fetching cities:", err);
    }
  };

  const handleGenerateRandomJobDescription = async (index) => {
    setLoadingIndex(index);
    const { jobTitle, company } = experiences[index];

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/random-job-description`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_title: jobTitle || "Software Engineer",
          company: company || "TechCorp",
          industry: "Software Engineering",
        }),
      });
      if (!response.ok) throw new Error("Failed to generate description");
      const data = await response.json();
      const updated = [...experiences];
      updated[index].jobDescription = data.randomJobDescription;
      setExperiences(updated);
    } catch (error) {
      alert("Error generating job description.");
      console.error(error);
    } finally {
      setLoadingIndex(null);
    }
  };

  return (
    <div className="experience-container">
      <div className="header">
        <h2 className="title">
          <MdOutlineWorkHistory size={20} />
          Work Experience
        </h2>
        <button className="add-btn" onClick={addExperience}>
          + Add Experience
        </button>
      </div>

      {experiences.map((exp, index) => (
        <div key={exp.id} className="experience-entry">
          <div className="form-group">
            <div className="experience-header-row">
              <label className="experience-label">Experience Entry</label>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button className="delete-btn" onClick={() => deleteExperience(index)}>
                  <RiDeleteBin6Line size={20} />
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Job Title</label>
              <input
                type="text"
                placeholder="Job Title"
                value={exp.jobTitle}
                onChange={(e) => {
                  const updated = [...experiences];
                  updated[index].jobTitle = e.target.value;
                  setExperiences(updated);
                }}
              />
            </div>

            <div className="form-group">
              <label>Company</label>
              <input
                type="text"
                placeholder="Company"
                value={exp.company}
                onChange={(e) => {
                  const updated = [...experiences];
                  updated[index].company = e.target.value;
                  setExperiences(updated);
                }}
              />
            </div>
            <div className="input-group">
              <label htmlFor={`country-${index}`}>Country</label>
              <select
                id={`country-${index}`}
                value={exp.country}
                onChange={(e) => handleCountryChange(e.target.value, index)}
                className="dropdown-select"
              >
                <option value="">Select Country</option>
                {countries.map((country) => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>

            <div className="location-row">
              <div style={{ flex: 1, marginRight: '8px' }}>
                <label htmlFor={`state-${index}`}>State</label>
                <select
                  id={`state-${index}`}
                  value={exp.state}
                  onChange={(e) => handleStateChange(e.target.value, index)}
                  disabled={!exp.country}
                  className="dropdown-select"
                >
                  <option value="">Select State</option>
                  {states.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              <div style={{ flex: 1, marginLeft: '8px' }}>
                <label htmlFor={`city-${index}`}>City</label>
                <select
                  id={`city-${index}`}
                  value={exp.city}
                  onChange={(e) => {
                    const updated = [...experiences];
                    updated[index].city = e.target.value;
                    setExperiences(updated);
                  }}
                  disabled={!exp.state}
                  className="dropdown-select"
                >
                  <option value="">Select City</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="input-group">
              <div className="date-row">
                <div className="date-group">
                  <label>Start Date</label>
                  <DatePicker
                    selected={exp.startDate ? new Date(exp.startDate) : null}
                    onChange={(date) => {
                      const updated = [...experiences];
                      updated[index].startDate = date ? date.toISOString() : null;
                      setExperiences(updated);
                    }}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Start date"
                    className="date-input"
                    showPopperArrow={false}
                  />
                </div>

                <div className="date-group">
                  <label>End Date</label>
                  <DatePicker
                    selected={exp.endDate ? new Date(exp.endDate) : null}
                    onChange={(date) => {
                      const updated = [...experiences];
                      updated[index].endDate = date ? date.toISOString() : null;
                      setExperiences(updated);
                    }}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="End date"
                    className="date-input"
                    showPopperArrow={false}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <div
                className="button-row"
                style={{ marginBottom: "8px", gap: "10px" }}
              >
                <button
                  onClick={() => handleGenerateRandomJobDescription(index)}
                  disabled={loadingIndex === index}
                  className="generate-button"
                >
                  <Sparkles size={14} />
                  {loadingIndex === index
                    ? "Generating..."
                    : "Generate with AI"}
                </button>
              </div>

              <textarea
                rows="4"
                placeholder="Job Description"
                value={exp.jobDescription}
                onChange={(e) => {
                  const updated = [...experiences];
                  updated[index].jobDescription = e.target.value;
                  setExperiences(updated);
                }}
                className="textarea-field"
              ></textarea>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Experience;
