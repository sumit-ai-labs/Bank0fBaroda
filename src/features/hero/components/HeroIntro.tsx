import React, { useEffect, useRef, useState } from "react";
import "./HeroIntro.css";

interface HeroIntroProps {
    onComplete: () => void;
}

export const HeroIntro: React.FC<HeroIntroProps> = ({ onComplete }) => {
    const [isFading, setIsFading] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const completedRef = useRef(false);

    const handleComplete = () => {
        if (completedRef.current) return;
        completedRef.current = true;
        setIsFading(true);
        setTimeout(() => {
            onComplete();
        }, 800); // Overlay fade out duration
    };

    const handleCompleteRef = useRef(handleComplete);
    useEffect(() => {
        handleCompleteRef.current = handleComplete;
    });

    useEffect(() => {
        // Trigger exit transition after exactly 2 seconds
        const timer = setTimeout(() => {
            handleCompleteRef.current();
        }, 2000);

        const v = videoRef.current;
        if (v) {
            v.play().catch((err) => {
                console.warn("Autoplay was blocked or failed.", err);
            });
        }

        return () => {
            clearTimeout(timer);
        };
    }, []);

    return (
        <div className={`hero-intro-overlay ${isFading ? "hero-intro-overlay--fade" : ""}`}>
            <video
                ref={videoRef}
                className="intro-video"
                src="/assets/bankvideo.mp4"
                muted
                playsInline
                preload="auto"
            />
            <div className="intro-text-overlay">
                <p className="intro-eyebrow">Bank of Baroda</p>
                <h2 className="intro-title">Behaviour Intelligence Platform</h2>
                <div className="intro-line"></div>
                <p className="intro-sub">Sustainability · Agriculture · Digital Transformation</p>
            </div>
        </div>
    );
};
