import React from "react";
import { heroContent } from "../../data/landing/hero";
import { BackgroundNodes } from "../../shared/BackgroundNodes/BackgroundNodes";
import { HeroCards } from "./components/HeroCards";
import "./Hero.css";

interface HeroProps {
    onStart: () => void;
    isIntroComplete: boolean;
}

export const Hero: React.FC<HeroProps> = ({
    onStart,
    isIntroComplete,
}) => {
    const activeClass = isIntroComplete ? "hero-section--active" : "";

    return (
        <section className={`hero-section ${activeClass}`}>
            <BackgroundNodes density={0.12} position="corners" opacity={0.15} />
            
            <div className="hero-bg-text-wrapper">
                <span className="hero-bg-text">{heroContent.backgroundWord}</span>
            </div>

            <div className="hero-grid-layout">
                <div className="hero-left-col">
                    <p className="hero-eyebrow-label">{heroContent.label}</p>
                    
                    <h1 className="hero-title-main">
                        {heroContent.titleLine1}
                        <br />
                        <span className="hero-title-orange">{heroContent.titleHighlight}</span>
                        <br />
                        {heroContent.titleLine2}
                    </h1>

                    <p className="hero-subtitle-line">{heroContent.subtitle}</p>

                    <p className="hero-description-paragraph">{heroContent.description}</p>
                    
                    <div className="hero-cta-btn-wrap">
                        <button className="hero-cta-btn" onClick={onStart}>
                            Explore the Platform
                            <span className="hero-cta-arrow">→</span>
                        </button>
                    </div>
                </div>

                <div className="hero-right-col">
                    <HeroCards />
                </div>
            </div>
        </section>
    );
};
