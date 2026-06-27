import React from "react";
import "./MicroActions.css";
import microActionImg from "../../assets/Micro Action.jpg";

interface MicroActionsProps {
    onBack?: () => void;
}

export const MicroActions: React.FC<MicroActionsProps> = ({ onBack }) => {
    return (
        <section className="micro-actions-section" aria-label="Micro Actions" style={{ position: "relative" }}>
            <img
                src={microActionImg}
                alt="Micro Actions"
                className="micro-actions-fullscreen-image"
                draggable={false}
            />
            {onBack && (
                <button
                    type="button"
                    onClick={onBack}
                    style={{
                        position: "absolute",
                        top: "100px",
                        left: "5vw",
                        zIndex: 10,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "11px 16px",
                        border: "1px solid rgba(46, 158, 91, 0.28)",
                        borderRadius: "999px",
                        background: "rgba(255, 255, 255, 0.74)",
                        color: "var(--color-text-primary)",
                        fontWeight: 900,
                        cursor: "pointer",
                        boxShadow: "0 10px 28px rgba(17, 17, 17, 0.07)",
                        fontSize: "13px",
                        fontFamily: "var(--font-primary)",
                        transition: "transform 280ms cubic-bezier(0.22, 1, 0.36, 1), border-color 280ms ease, background 280ms ease, box-shadow 280ms ease"
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-3px)";
                        e.currentTarget.style.borderColor = "rgba(46, 158, 91, 0.52)";
                        e.currentTarget.style.background = "rgba(46, 158, 91, 0.1)";
                        e.currentTarget.style.boxShadow = "0 20px 48px rgba(46, 158, 91, 0.14)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "none";
                        e.currentTarget.style.borderColor = "rgba(46, 158, 91, 0.28)";
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.74)";
                        e.currentTarget.style.boxShadow = "0 10px 28px rgba(17, 17, 17, 0.07)";
                    }}
                >
                    <span style={{ color: "#2e9e5b", transition: "transform 240ms ease" }}>&lt;-</span>
                    Back to Behaviour
                </button>
            )}
        </section>
    );
};
