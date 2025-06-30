// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ResumeUploadUI from './components/Leading';
import EditResumePage from './components/EditResumePage';
import BlankResume from './components/BlankResume';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ResumeUploadUI />} />
        <Route path="/edit-resume" element={<EditResumePage />} />
        <Route path="/blank-resume" element={<BlankResume />} />
      </Routes>
    </Router>
  );
}

export default App;
