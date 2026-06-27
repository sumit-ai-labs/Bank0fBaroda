import React from "react";
import "./PlatformNavbar.css";

interface PlatformNavbarProps {
    currentSection: number;
}

export const PlatformNavbar: React.FC<PlatformNavbarProps> = ({ currentSection }) => {
    // Hardcoded to 100% per user request
    const progressPercentage = 100;

    // Hide navbar on the Micro Actions section (index 5)
    const isHidden = currentSection === 5;

    return (
        <nav className={`platform-navbar${isHidden ? " platform-navbar--hidden" : ""}`}>
            <div className="navbar-left">
                <img src="/assets/boblogo.png" alt="Bank of Baroda" className="navbar-logo" />
            </div>
            <div className="navbar-right">
                <img src="/assets/image.png" alt="Pactacy" className="navbar-logo" />
                <div className="progress-container">
                    <span className="progress-label">{progressPercentage}%</span>
                    <span className="progress-sub">BEHAVIOUR</span>
                </div>
            </div>
        </nav>
    );
};

