import React from "react";
import "./GlassCard.css";

interface GlassCardProps {
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
}

export const GlassCard: React.FC<GlassCardProps> = ({
    className = "",
    style,
    children,
}) => {
    return (
        <div className={`glass-card ${className}`} style={style}>
            {children}
        </div>
    );
};
