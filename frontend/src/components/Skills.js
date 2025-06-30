import React, { useState } from 'react';
import { GiSkills } from "react-icons/gi";
import { RiDeleteBin6Line } from "react-icons/ri";
import './Skills.css';

const Skill = () => {
    const [skills, setSkills] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [newSkill, setNewSkill] = useState({ skillName: '', proficiency: '' });

    const openPopup = () => {
        setShowPopup(true);
        setNewSkill({ skillName: '', proficiency: '' });
    };

    const closePopup = () => {
        setShowPopup(false);
    };

    const insertSkill = () => {
        if (newSkill.skillName && newSkill.proficiency) {
            setSkills([...skills, { id: Date.now(), ...newSkill }]);
            closePopup();
        } else {
            alert("Please enter both skill and proficiency.");
        }
    };

    const deleteSkill = (idToDelete) => {
        const updated = skills.filter(skill => skill.id !== idToDelete);
        setSkills(updated);
    };

    return (
        <div className="skill-container">
            <div className="header">
                <h2 className="title">
                    <GiSkills size={20} /> Skills
                </h2>
                <button className="add-btn" onClick={openPopup}>+ Add Skills</button>
            </div>

            <div className="skills-list-box">
                {skills.map(skill => (
                    <div key={skill.id} className="skill-item inserted">
                        <input
                            type="text"
                            readOnly
                            value={`${skill.skillName} (${skill.proficiency})`}
                        /><button className="delete-btn" onClick={() => deleteSkill(skill.id)}>
                            <RiDeleteBin6Line size={16} />
                        </button>
                    </div>
                ))}
            </div>

            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-box">
                        <h3>Add New Skill</h3>
                        <div className="input-group">
                            <label>Skill</label>
                            <input
                                type="text"
                                value={newSkill.skillName}
                                onChange={(e) => setNewSkill({ ...newSkill, skillName: e.target.value })}
                                placeholder="Enter skill"
                            />
                        </div>
                        <div className="input-group">
                            <label>Proficiency</label>
                            <select
                                value={newSkill.proficiency}
                                onChange={(e) => setNewSkill({ ...newSkill, proficiency: e.target.value })}
                            >
                                <option value="">Select</option>
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                        </div>
                        <div className="popup-buttons">
                            <button className="insert-btn" onClick={insertSkill}>Insert</button>
                            <button className="cancel-btn" onClick={closePopup}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Skill;
