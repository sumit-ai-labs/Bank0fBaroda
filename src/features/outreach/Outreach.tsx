import React, { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { BackgroundNodes } from "../../shared/BackgroundNodes/BackgroundNodes";
import "./Outreach.css";

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────
export interface OutreachVideo {
    id: string;
    title: string;
    caption: string;
    desc: string;
    topics: string[];
    duration: string;
    category: string;
    isPrimary: boolean;
}

export const OUTREACH_VIDEOS: OutreachVideo[] = [
    {
        id: "v-financial-literacy",
        title: "Farmer Financial Literacy",
        caption: "Banking Basics",
        desc: "Learn how to access Bank of Baroda's agricultural schemes and digital banking tools for sustainable farm growth.",
        topics: ["Bank schemes", "Loan eligibility", "Digital payments"],
        duration: "8 min",
        category: "Education",
        isPrimary: true,
    },
    {
        id: "v-digital-banking",
        title: "Digital Banking for Farmers",
        caption: "Mobile Banking",
        desc: "Step-by-step guide to managing your farm finances through the BOB mobile app and UPI services.",
        topics: ["Mobile app", "UPI payments", "Account management"],
        duration: "6 min",
        category: "Technology",
        isPrimary: false,
    },
    {
        id: "v-green-krishi",
        title: "Green Krishi Success Stories",
        caption: "Success Stories",
        desc: "Real farmer journeys showcasing improved productivity and income through Green Krishi solutions.",
        topics: ["Crop yields", "Farmer income", "Sustainability"],
        duration: "12 min",
        category: "Inspiration",
        isPrimary: false,
    },
    {
        id: "v-crop-loan",
        title: "Crop Loan Application Guide",
        caption: "Loan Process",
        desc: "A clear, step-by-step walkthrough of how to apply for a crop loan with Bank of Baroda.",
        topics: ["Documentation", "Eligibility", "Approval process"],
        duration: "10 min",
        category: "Finance",
        isPrimary: false,
    },
    {
        id: "v-insurance",
        title: "Crop Insurance & Protection",
        caption: "Risk Management",
        desc: "Understanding Pradhan Mantri Fasal Bima Yojana and how to protect your harvest with insurance.",
        topics: ["PMFBY scheme", "Claim process", "Risk coverage"],
        duration: "7 min",
        category: "Protection",
        isPrimary: false,
    },
    {
        id: "v-market-connect",
        title: "Market Connect for Farmers",
        caption: "Market Access",
        desc: "How to connect with reliable buyers, understand market pricing, and use digital marketplaces.",
        topics: ["Digital markets", "Price discovery", "Buyer connect"],
        duration: "9 min",
        category: "Commerce",
        isPrimary: false,
    },
    {
        id: "v-soil-health",
        title: "Soil Health Management",
        caption: "Sustainable Farming",
        desc: "Best practices for maintaining soil health, nutrient management, and sustainable agriculture techniques.",
        topics: ["Nutrient testing", "Organic farming", "Long-term yield"],
        duration: "11 min",
        category: "Agri-Science",
        isPrimary: false,
    },
    {
        id: "v-water-conservation",
        title: "Water Conservation Techniques",
        caption: "Irrigation",
        desc: "Efficient irrigation methods including drip irrigation, rainwater harvesting, and water-use optimisation.",
        topics: ["Drip irrigation", "Rainwater harvest", "Water budgeting"],
        duration: "8 min",
        category: "Conservation",
        isPrimary: false,
    },
];

// ─────────────────────────────────────────────────────────────────────────────
// Scatter positions — 4 cards per side, clear center for the heading
// ─────────────────────────────────────────────────────────────────────────────
interface ScatterPos {
    top: number;
    left: number;
    baseWidth: number;
    rotate: number;
}

const SCATTER: ScatterPos[] = [
    { top: 9,  left: 2,   baseWidth: 188, rotate: -3.2 }, // left-col1 top
    { top: 57, left: 1,   baseWidth: 175, rotate:  2.1 }, // left-col1 bottom
    { top: 9,  left: 20,  baseWidth: 182, rotate:  1.6 }, // left-col2 top
    { top: 57, left: 21,  baseWidth: 192, rotate: -2.4 }, // left-col2 bottom
    { top: 9,  left: 63,  baseWidth: 178, rotate:  2.8 }, // right-col1 top
    { top: 57, left: 64,  baseWidth: 175, rotate: -1.9 }, // right-col1 bottom
    { top: 9,  left: 82,  baseWidth: 185, rotate:  1.4 }, // right-col2 top
    { top: 57, left: 81,  baseWidth: 188, rotate: -3.1 }, // right-col2 bottom
];

interface PlacedVideo extends OutreachVideo, ScatterPos {
    floatDuration: number;
    floatDelay: number;
    floatX: number;
    floatY: number;
    floatRotate: number;
}

function buildPlacedVideos(): PlacedVideo[] {
    return OUTREACH_VIDEOS.map((video, i) => ({
        ...video,
        ...SCATTER[i],
        floatDuration: 4.8 + (i % 3) * 1.1,
        floatDelay:    -(i * 0.85),
        floatX:        (i % 2 === 0 ? 1 : -1) * (3 + (i % 3)),
        floatY:        (i % 3 === 0 ? 1 : -1) * (4 + (i % 2) * 2),
        floatRotate:   (i % 2 === 0 ? 0.4 : -0.4),
    }));
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
interface OutreachProps {
    onVideoSelect?: (id: string) => void;
}

export const Outreach: React.FC<OutreachProps> = ({ onVideoSelect }) => {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [hoveredId,  setHoveredId]  = useState<string | null>(null);

    const placedVideos = useMemo(buildPlacedVideos, []);

    const selectedVideo = useMemo(
        () => placedVideos.find(v => v.id === selectedId) ?? null,
        [placedVideos, selectedId],
    );

    const isPanelOpen = selectedId !== null;

    const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
            }
        };
    }, []);

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleCardClick = useCallback((id: string) => {
        if (onVideoSelect) {
            onVideoSelect(id);
        } else {
            setSelectedId(prev => (prev === id ? null : id));
        }
    }, [onVideoSelect]);

    const handleClose = useCallback(() => setSelectedId(null), []);

    const handleMouseEnter = useCallback((id: string) => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
        }
        hoverTimeoutRef.current = setTimeout(() => {
            setHoveredId(id);
        }, 150);
    }, []);

    const handleMouseLeave = useCallback(() => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
            hoverTimeoutRef.current = null;
        }
        setHoveredId(null);
    }, []);

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <section className="out-root" aria-label="Outreach Video Library">
            <BackgroundNodes density={0.09} position="corners" opacity={0.12} />
            <div className="out-watermark" aria-hidden="true">OUTREACH</div>

            {/* ── Scatter grid ──────────────────────────────────────────── */}
            <div className="out-canvas">
                <div className="out-composition-wrapper">
                    <div className="out-composition-drift">
                        {placedVideos.map((item, i) => {
                            const isSelected = selectedId === item.id;
                            const isHovered  = hoveredId  === item.id;
                            const isDimmed   =
                                (hoveredId !== null && !isHovered) ||
                                (isPanelOpen && !isSelected);

                            return (
                                <div
                                    key={item.id}
                                    className="out-tile-hitbox"
                                    style={{ top: `${item.top}%`, left: `${item.left}%` }}
                                >
                                    <div
                                        className="out-tile-float"
                                        style={{
                                            "--out-float-dur":   `${item.floatDuration}s`,
                                            "--out-float-delay": `${item.floatDelay}s`,
                                            "--out-float-x":     `${item.floatX}px`,
                                            "--out-float-y":     `${item.floatY}px`,
                                            "--out-float-rot":   `${item.floatRotate}deg`,
                                            "--out-stagger":     `${i * 40}ms`,
                                        } as React.CSSProperties}
                                    >
                                        <div className="out-tile-enter">
                                            <button
                                                type="button"
                                                aria-label={`Watch ${item.title}`}
                                                className={[
                                                    "out-tile",
                                                    isDimmed   ? "out-tile--dimmed"   : "",
                                                    isSelected ? "out-tile--selected" : "",
                                                    item.isPrimary ? "out-tile--primary" : "",
                                                ].join(" ").trim()}
                                                style={{
                                                    "--out-base-w": `${item.baseWidth}px`,
                                                    "--out-rotate": `${item.rotate}deg`,
                                                } as React.CSSProperties}
                                                onClick={() => handleCardClick(item.id)}
                                                onMouseEnter={() => handleMouseEnter(item.id)}
                                                onMouseLeave={handleMouseLeave}
                                            >
                                                <div className="out-card">
                                                    {item.isPrimary && (
                                                        <div className="out-card-primary-strip" aria-hidden="true" />
                                                    )}

                                                    {/* Video thumbnail */}
                                                    <div className="out-card-video-wrap">
                                                        <img
                                                            className="out-card-video-placeholder"
                                                            src={`https://picsum.photos/seed/out-${item.id}/320/180`}
                                                            alt=""
                                                            draggable={false}
                                                        />
                                                        {(isHovered || isSelected) && (
                                                            <video
                                                                className="out-card-video"
                                                                src="/assets/bankvideo.mp4"
                                                                muted
                                                                preload="auto"
                                                                playsInline
                                                                loop
                                                                autoPlay
                                                                draggable={false}
                                                                style={{
                                                                    position: "absolute",
                                                                    inset: 0,
                                                                    width: "100%",
                                                                    height: "100%",
                                                                    objectFit: "cover",
                                                                }}
                                                            />
                                                        )}
                                                        {/* Play icon overlay */}
                                                        <div className="out-card-play" aria-hidden="true">
                                                            <svg viewBox="0 0 32 32" fill="none">
                                                                <circle cx="16" cy="16" r="14"
                                                                    fill="rgba(255,255,255,0.92)"
                                                                    stroke="rgba(235,101,37,0.18)"
                                                                    strokeWidth="1.5"
                                                                />
                                                                <polygon
                                                                    points="13,10 24,16 13,22"
                                                                    fill="#eb6525"
                                                                />
                                                            </svg>
                                                        </div>
                                                    </div>

                                                    {/* Text body */}
                                                    <div className="out-card-body">
                                                        <span className="out-card-caption">{item.caption}</span>
                                                        <h3 className="out-card-title">{item.title}</h3>
                                                        <span className="out-card-meta">{item.duration} · {item.category}</span>
                                                    </div>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Ambient glow behind heading */}
                <div className="out-heading-ambient" aria-hidden="true" />

                {/* Centre heading — hides when panel is open */}
                <div className={`out-heading ${isPanelOpen ? "out-heading--hidden" : ""}`}>
                    <p className="out-heading-eyebrow">Bank of Baroda · Green Krishi Outreach</p>
                    <h2 className="out-heading-title">
                        Explore <span className="out-orange">Outreach</span>
                        Video Library
                    </h2>
                    <p className="out-heading-body">
                        Educational videos on sustainable farming,<br />
                        banking solutions and financial literacy.
                    </p>
                    <p className="out-heading-sub">Hover to Preview · Click to Watch</p>
                </div>
            </div>

            {/* ── Detail panel (slides in from right on card click) ──────── */}
            <aside
                className={`out-panel ${isPanelOpen ? "out-panel--open" : ""}`}
                aria-label="Video details"
            >
                {selectedVideo && (
                    <>
                        <button
                            type="button"
                            className="out-panel-close"
                            onClick={handleClose}
                            aria-label="Close video panel"
                        >
                            ✕
                        </button>

                        <div className="out-panel-inner" key={selectedVideo.id}>
                            {/* Embedded video player */}
                            <div className="out-panel-video-frame">
                                <video
                                    className="out-panel-video"
                                    src="/assets/bankvideo.mp4"
                                    controls
                                    playsInline
                                    muted
                                    autoPlay
                                />
                            </div>

                            {/* Info copy */}
                            <div className="out-panel-copy">
                                <p className="out-panel-eyebrow">
                                    {selectedVideo.category} · {selectedVideo.duration}
                                </p>
                                <h2 className="out-panel-title">{selectedVideo.title}</h2>
                                <p className="out-panel-desc">{selectedVideo.desc}</p>

                                <div className="out-panel-topics">
                                    {selectedVideo.topics.map(topic => (
                                        <em key={topic}>{topic}</em>
                                    ))}
                                </div>

                                <button type="button" className="out-panel-cta">
                                    Watch Full Video
                                    <span aria-hidden="true">-&gt;</span>
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </aside>
        </section>
    );
};
