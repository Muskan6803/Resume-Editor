import React, { useState } from "react";
import { Sparkles } from "lucide-react";
import { GoProjectSymlink } from "react-icons/go";
import { RiDeleteBin6Line } from "react-icons/ri";
import './Projects.css'

const Projects = () => {
    const [projects, setProjects] = useState([
        { id: 1, title: "", technologies: [], role: "", description: "" },
    ]);
    const [loadingIndex, setLoadingIndex] = useState(null); 

    const addProject = () => {
        setProjects([
            ...projects,
            { id: projects.length + 1, title: "", technologies: [], role: "", description: "" },
        ]);
    };

    const deleteProject = (indexToRemove) => {
        const updated = projects.filter((_, i) => i !== indexToRemove);
        setProjects(updated);
    };

    const updateProjectField = (index, field, value) => {
        const updatedProjects = [...projects];
        updatedProjects[index][field] = value;
        setProjects(updatedProjects);
    };

    const handleGenerateRandomDescription = async (index) => {
        setLoadingIndex(index);
        try {
            const project = projects[index];
            const response = await fetch(`${process.env.REACT_APP_API_URL}/random-description`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: project.title,
                    technologies: project.technologies,
                    role: project.role,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to generate project description: ${errorText}`);
            }

            const data = await response.json();
            updateProjectField(index, "description", data.randomdescription);
        } catch (error) {
            console.error("API error:", error);
            alert("Error generating project description. Please try again.");
        } finally {
            setLoadingIndex(null);
        }
    };

    return (
        <div className="personal-info-container">
            <div className="header">
                <h2 className="title">
                    <GoProjectSymlink size={20} />
                    Projects
                </h2>
                <button className="add-btn" onClick={addProject}>
                    + Add Project
                </button>
            </div>

            {projects.map((project, index) => (
                <div key={project.id} className="inside-group">
                    <div className="input-grid">
                        <div className="project-entry" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <label className="project-label">Project Entry</label>
                            <button className="delete-btn" onClick={() => deleteProject(index)}>
                                <RiDeleteBin6Line size={20} />
                            </button>
                        </div>
                        <div className="input-pair">
                            <input
                                type="text"
                                placeholder="Project Title"
                                value={project.title}
                                onChange={(e) => updateProjectField(index, "title", e.target.value)}
                                className="input-field"
                            />

                            <input
                                type="text"
                                placeholder="Technologies"
                                value={project.technologies.join(", ")}
                                onChange={(e) =>
                                    updateProjectField(index, "technologies", e.target.value.split(",").map((t) => t.trim()))
                                }
                                className="input-field"
                            />

                            <input
                                type="text"
                                placeholder="Role"
                                value={project.role}
                                onChange={(e) => updateProjectField(index, "role", e.target.value)}
                                className="input-field"
                            />
                        </div>

                        <div className="button-row">
                            <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
                                <button
                                    onClick={() => handleGenerateRandomDescription(index)}
                                    disabled={loadingIndex === index}
                                    className="generate-button"
                                >
                                    <Sparkles size={14} />
                                    {loadingIndex === index ? "Generating..." : "Generate With AI"}
                                </button>
                            </div>

                            <textarea
                                placeholder="Project Description"
                                value={project.description}
                                onChange={(e) => updateProjectField(index, "description", e.target.value)}
                                rows={4}
                                className="textarea-field"
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Projects;
