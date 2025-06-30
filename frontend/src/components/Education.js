import React, { useState, useEffect } from 'react';
import { MdCastForEducation } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import './Education.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Education({ setEducationData }) {
    const [education, setEducation] = useState([
        {
            id: 1,
            degree: '',
            course: '',
            country: '',
            state: '',
            city: '',
            college: '',
            gpa: '',
            startDate: '',
            endDate: ''
        }
    ]);

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    const addEducation = () => {
        setEducation([
            ...education,
            {
                id: education.length + 1,
                degree: '',
                course: '',
                country: '',
                state: '',
                city: '',
                college: '',
                gpa: '',
                startDate: '',
                endDate: ''
            }
        ]);
    };

    const deleteEducation = (indexToRemove) => {
        const updated = education.filter((_, i) => i !== indexToRemove);
        setEducation(updated);
    };
    useEffect(() => {
        setEducationData(education);
    }, [education]);

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
        const updated = [...education];
        updated[index].country = value;
        updated[index].state = '';
        updated[index].city = '';
        setEducation(updated);

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
        const updated = [...education];
        updated[index].state = value;
        updated[index].city = '';
        setEducation(updated);

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

    return (
        <div className="education-container">
            <div className='header'>
                <h2 className="title">
                    <MdCastForEducation size={20} /> Education
                </h2>
                <button className="add-btn" onClick={addEducation}>+ Add Education</button>
            </div>

            <div className='education-details'>
                {education.map((edu, index) => (
                    <div key={edu.id} className='education-entry'>
                        <div className="form-group-header">
                            <div className='education-header-row'>
                                <label className='education-label'>Education Entry</label>
                                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                    <button className="delete-btn" onClick={() => deleteEducation(index)}>
                                        <RiDeleteBin6Line size={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="input-group">
                                <label>Degree</label>
                                <input
                                    type="text"
                                    placeholder='Degree'
                                    value={edu.degree}
                                    onChange={(e) => {
                                        const updated = [...education];
                                        updated[index].degree = e.target.value;
                                        setEducation(updated);
                                    }} />
                            </div>
                            <div className="input-group">
                                <label>Course</label>
                                <input
                                    type="text"
                                    placeholder='Course'
                                    value={edu.course}
                                    onChange={(e) => {
                                        const updated = [...education];
                                        updated[index].course = e.target.value;
                                        setEducation(updated);
                                    }} />
                            </div>
                            <div className="input-group">
                                <label htmlFor={`country-${index}`}>Country</label>
                                <select
                                    id={`country-${index}`}
                                    value={edu.country}
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
                                        value={edu.state}
                                        onChange={(e) => handleStateChange(e.target.value, index)}
                                        disabled={!edu.country}
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
                                        value={edu.city}
                                        onChange={(e) => {
                                            const updated = [...education];
                                            updated[index].city = e.target.value;
                                            setEducation(updated);
                                        }}
                                        disabled={!edu.state}
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
                                <label>College/ University</label>
                                <input
                                    type="text"
                                    placeholder='College/ University'
                                    value={edu.college}
                                    onChange={(e) => {
                                        const updated = [...education];
                                        updated[index].college = e.target.value;
                                        setEducation(updated);
                                    }} />
                            </div>
                            <div className="input-group">
                                <label>GPA</label>
                                <input
                                    type="text"
                                    placeholder='GPA'
                                    value={edu.gpa}
                                    onChange={(e) => {
                                        const updated = [...education];
                                        updated[index].gpa = e.target.value;
                                        setEducation(updated);
                                    }} />
                            </div>

                            <div className='input-group'>
                                <div className="date-row">
                                    <div className="date-group">
                                        <label>Start Date</label>
                                        <DatePicker
                                            selected={edu.startDate ? new Date(edu.startDate) : null}
                                            onChange={(date) => {
                                                const updated = [...education];
                                                updated[index].startDate = date.toISOString();
                                                setEducation(updated);
                                            }}
                                            dateFormat="dd/MM/yyyy"
                                            placeholderText="Start date"
                                            className="date-input"
                                            showPopperArrow={false} />
                                    </div>

                                    <div className="date-group">
                                        <label>End Date</label>
                                        <DatePicker
                                            selected={edu.endDate ? new Date(edu.endDate) : null}
                                            onChange={(date) => {
                                                const updated = [...education];
                                                updated[index].endDate = date.toISOString();
                                                setEducation(updated);
                                            }}
                                            dateFormat="dd/MM/yyyy"
                                            placeholderText="End date"
                                            className="date-input"
                                            showPopperArrow={false} />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Education;