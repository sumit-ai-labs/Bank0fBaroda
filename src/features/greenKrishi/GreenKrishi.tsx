import React, { useEffect, useRef } from "react";
import "./GreenKrishi.css";

interface GreenKrishiProps {
    pageStatus: "idle" | "transition-zoom" | "transition-fade" | "video-playing" | "cross-fading" | "completed";
}

const insights = [
    {
        title: "Farm Discipline",
        quote: "I don't maintain crop plans, expenses, or farming records consistently.",
    },
    {
        title: "Digital Agriculture",
        quote: "I rarely use digital tools because they seem difficult or unfamiliar.",
    },
    {
        title: "Farm Investment",
        quote: "I hesitate to invest because I'm uncertain about the long-term benefits.",
    },
    {
        title: "Market Linkage",
        quote: "I struggle to connect with reliable buyers and better market opportunities.",
    },
    {
        title: "Green Mindset",
        quote: "I prioritize short-term crop yields over long-term soil health and sustainable practices.",
    },
];

export const GreenKrishi: React.FC<GreenKrishiProps> = ({ pageStatus }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const v = videoRef.current;
        if (!v) return;

        if (pageStatus === "video-playing") {
            v.currentTime = 0;
            v.play().catch((err) => console.log("Video playback started. Status:", err));
        } else if (pageStatus === "idle") {
            v.pause();
            v.currentTime = 0;
        }
    }, [pageStatus]);

    const isVideoVisible = pageStatus !== "completed";
    const isActive = pageStatus === "completed";

    return (
        <section className="s3-root">
            <div 
                className={`s3-layer ${isVideoVisible ? "s3-layer--visible" : ""}`}
                style={{
                    opacity: pageStatus === "cross-fading" || pageStatus === "completed" ? 0 : 1,
                    transition: "opacity 700ms cubic-bezier(0.22, 1, 0.36, 1)",
                    zIndex: 1,
                    pointerEvents: pageStatus === "completed" ? "none" : "auto",
                }}
            >
                <video
                    ref={videoRef}
                    className="s3-media"
                    src="/assets/bankvideo.mp4"
                    muted
                    playsInline
                    preload="auto"
                />
            </div>
            
            <div className={`s3-insights-stage ${isActive ? "s3-insights-stage--active" : ""}`}>
                <div className="s3-watermark" aria-hidden="true">GREEN KRISHI</div>

                <div className="s3-summary-card">
                    <p className="s3-eyebrow">Bank of Baroda / Behaviour Intelligence</p>
                    <h2>
                        Green Krishi
                        <span>Behaviour Insights</span>
                    </h2>
                    <p>
                        The video reveals practical behaviour barriers that affect how farmers plan,
                        adopt digital tools, invest in their farms, connect to markets, and build
                        confidence in sustainable agriculture.
                    </p>
                    <span className="s3-summary-line" />
                    <p className="s3-summary-note">Scroll to continue into behaviour cards.</p>
                </div>

                <div className="s3-insight-cloud" aria-label="Green Krishi insight cards">
                    {insights.map((insight, index) => (
                        <article
                            key={insight.title}
                            className={`s3-insight-card s3-insight-card--${index + 1}`}
                            style={{ "--card-idx": index } as React.CSSProperties}
                        >
                            <span className="s3-insight-number">{String(index + 1).padStart(2, "0")}</span>
                            <h3>{insight.title}</h3>
                            <p>"{insight.quote}"</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};
