import React, { useState, useCallback, useEffect, useRef } from "react";
import "./HeroCards.css";

/* ── Card Data ─────────────────────────────────────────────────── */
interface HeroCard {
    id: string;
    title: string;
    desc: string;
    accent: string;
    lightBg: string;
    icon: React.ReactNode;
}

const HERO_CARDS: HeroCard[] = [
    {
        id: "01",
        title: "Behaviour Research",
        desc: "Deep qualitative and quantitative understanding of citizens and communities.",
        accent: "#1E6FD9",
        lightBg: "#EBF2FC",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
            </svg>
        ),
    },
    {
        id: "02",
        title: "Behaviour Design",
        desc: "Evidence-based interventions designed for real-world adoption.",
        accent: "#E85D26",
        lightBg: "#FDF0EB",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
        ),
    },
    {
        id: "03",
        title: "Behaviour Media",
        desc: "Strategic communication to shift perception and prompt citizen action.",
        accent: "#D4A017",
        lightBg: "#FEF9E7",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 12c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2s10 4.48 10 10z" />
                <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32" />
            </svg>
        ),
    },
    {
        id: "04",
        title: "Behaviour Measurement",
        desc: "Tracking and quantifying behaviour change with precision and integrity.",
        accent: "#2DBD6E",
        lightBg: "#EAF8F1",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
        ),
    },
    {
        id: "05",
        title: "Behaviour Legacy",
        desc: "Institutionalising change to create sustainable long-term public value.",
        accent: "#333333",
        lightBg: "#F2F2F2",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
        ),
    },
];

const AUTO_MS = 2200;

export const HeroCards: React.FC = () => {
    const [active, setActive] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const [progress, setProgress] = useState(0);

    /* ── Auto-play ──────────────────────────────────────────────── */
    const startAutoPlay = useCallback(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (progressRef.current) clearInterval(progressRef.current);
        setProgress(0);

        progressRef.current = setInterval(() => {
            setProgress((p) => Math.min(p + (20 / AUTO_MS) * 100, 100));
        }, 20);

        intervalRef.current = setInterval(() => {
            setActive((prev) => (prev + 1) % HERO_CARDS.length);
            setProgress(0);
        }, AUTO_MS);
    }, []);

    const stopAutoPlay = useCallback(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (progressRef.current) clearInterval(progressRef.current);
    }, []);

    useEffect(() => {
        if (!isPaused) startAutoPlay();
        else stopAutoPlay();
        return () => stopAutoPlay();
    }, [isPaused, startAutoPlay, stopAutoPlay]);

    /* ── Handlers ───────────────────────────────────────────────── */
    const goTo = useCallback(
        (idx: number) => {
            setActive(idx);
            setProgress(0);
            if (!isPaused) startAutoPlay();
        },
        [isPaused, startAutoPlay]
    );

    const handleBgCardClick = useCallback(
        (idx: number, e: React.MouseEvent) => {
            e.stopPropagation();
            goTo(idx);
        },
        [goTo]
    );

    const handleNextClick = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            setActive((prev) => (prev + 1) % HERO_CARDS.length);
            setProgress(0);
            if (!isPaused) startAutoPlay();
        },
        [isPaused, startAutoPlay]
    );

    /* ── Render ─────────────────────────────────────────────────── */
    return (
        <div className="hero-cards-visual">
            <div
                className="hcs-stack"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                {HERO_CARDS.map((card, idx) => {
                    const diff = (idx - active + HERO_CARDS.length) % HERO_CARDS.length;
                    const isFront = diff === 0;

                    let transform = "";
                    let opacity = 1;

                    if (diff === 0)      { transform = "translate3d(0,0,0) rotate(0deg) scale(1)"; }
                    else if (diff === 1) { transform = "translate3d(16px,-16px,0) rotate(4deg) scale(0.94)"; opacity = 0.88; }
                    else if (diff === 2) { transform = "translate3d(32px,-32px,0) rotate(8deg) scale(0.88)"; opacity = 0.65; }
                    else if (diff === 3) { transform = "translate3d(48px,-48px,0) rotate(12deg) scale(0.82)"; opacity = 0.35; }
                    else                { transform = "translate3d(64px,-64px,0) rotate(16deg) scale(0.76)"; opacity = 0; }

                    return (
                        <div
                            key={card.id}
                            className={`hcs-card ${isFront ? "hcs-card--front" : "hcs-card--back"}`}
                            style={{
                                transform,
                                opacity,
                                zIndex: 20 - diff,
                                backgroundColor: isFront ? card.accent : card.lightBg,
                                border: `1px solid ${isFront ? "transparent" : card.accent + "28"}`,
                                cursor: isFront ? "default" : "pointer",
                            }}
                            onClick={!isFront ? (e) => handleBgCardClick(idx, e) : undefined}
                        >
                            {isFront ? (
                                /* ── Front card ── */
                                <>
                                    {/* Progress bar */}
                                    <div
                                        className="hcs-progress-bar"
                                        style={{ width: `${progress}%` }}
                                    />

                                    {/* Top row */}
                                    <div className="hcs-top-row">
                                        <div className="hcs-dot" />
                                        <span className="hcs-icon">{card.icon}</span>
                                    </div>

                                    {/* Content */}
                                    <div className="hcs-body">
                                        <h4 className="hcs-title">{card.title}</h4>
                                        <p className="hcs-desc">{card.desc}</p>
                                    </div>

                                    {/* Footer */}
                                    <div className="hcs-footer">
                                        <span className="hcs-num">{card.id}</span>
                                        <button
                                            type="button"
                                            className="hcs-arrow-btn"
                                            onClick={handleNextClick}
                                            aria-label="Next card"
                                        >
                                            →
                                        </button>
                                    </div>
                                </>
                            ) : (
                                /* ── Back card (peek) ── */
                                <div className="hcs-back-inner">
                                    <div
                                        className="hcs-dot"
                                        style={{ backgroundColor: card.accent + "50" }}
                                    />
                                    <h4 className="hcs-back-title" style={{ color: card.accent }}>
                                        {card.title}
                                    </h4>
                                    <span className="hcs-back-num" style={{ color: card.accent + "28" }}>
                                        {card.id}
                                    </span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Dot indicators below the stack */}
            <div className="hcs-dots">
                {HERO_CARDS.map((_card, i) => (
                    <button
                        key={i}
                        type="button"
                        className={`hcs-dot-ind ${i === active ? "hcs-dot-ind--active" : ""}`}
                        style={
                            { "--dot-accent": HERO_CARDS[active].accent } as React.CSSProperties
                        }
                        onClick={() => goTo(i)}
                        aria-label={`Go to card ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};
