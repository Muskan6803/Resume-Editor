import React, { useState } from "react";
import { LiaAwardSolid } from "react-icons/lia";
const CertificateAwards = () => {
    return (
        <div className="personal-info-container">
            <div className="header">
                <h2 className="title">
                    <LiaAwardSolid size={20} />
                    Certificates & Awards
                </h2>
            </div>
            <textarea
                placeholder="Write Your Certificates/Awards Here"
                className="textarea-field"
            />
        </div>
    );
}

export default CertificateAwards;
