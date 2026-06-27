import React, { useState, useRef, useCallback, useMemo } from "react";
import { SCHEME_ITEMS, scatterLayout } from "../../data/landing/schemes";
import type { PlacedItem } from "../../data/landing/schemes";
import { BackgroundNodes } from "../../shared/BackgroundNodes/BackgroundNodes";
import "./Schemes.css";

interface SchemesProps {
    onSchemeClick: (item: PlacedItem, rect: DOMRect) => void;
    isTransitioning: boolean;
}

// Non-uniform depth levels — creates cinematic layering across 12 cards
const DEPTH = [1.0, 0.97, 0.99, 0.96, 0.98, 1.0, 1.02, 0.99, 0.98, 0.97, 0.95, 0.95];

export const Schemes: React.FC<SchemesProps> = ({ onSchemeClick, isTransitioning }) => {

    // ════════════════════════════════════════════════════════════════
    //  EXISTING ENGINE — completely unchanged
    // ════════════════════════════════════════════════════════════════
    const placedItems = useMemo(() => scatterLayout(SCHEME_ITEMS), []);
    const [hoveredId, setHoveredId]  = useState<string | null>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);

    const handleEnter = useCallback((item: PlacedItem, e: React.MouseEvent) => {
        setHoveredId(item.id);
        const t = tooltipRef.current;
        if (!t) return;
        t.textContent = item.tooltip;
        t.style.opacity = "1";
        t.style.left = `${e.clientX + 14}px`;
        t.style.top  = `${e.clientY - 14}px`;
    }, []);

    const handleMove = useCallback((e: React.MouseEvent) => {
        const t = tooltipRef.current;
        if (!t) return;
        t.style.left = `${e.clientX + 14}px`;
        t.style.top  = `${e.clientY - 14}px`;
    }, []);

    const handleLeave = useCallback(() => {
        setHoveredId(null);
        const t = tooltipRef.current;
        if (t) t.style.opacity = "0";
    }, []);

    const handleTileClick = useCallback((item: PlacedItem, e: React.MouseEvent<HTMLButtonElement>) => {
        if (isTransitioning) return;
        const rect = e.currentTarget.getBoundingClientRect();
        onSchemeClick(item, rect);
    }, [isTransitioning, onSchemeClick]);

    // ════════════════════════════════════════════════════════════════

    return (
        <section className="s2-root">
            {/* Reuse Hero's corner node system — no new engine */}
            <BackgroundNodes density={0.09} position="corners" opacity={0.12} />

            {/* Watermark — same treatment as Hero, 1.5% opacity */}
            <div className="s2-watermark" aria-hidden="true">SCHEMES</div>

            <div className="s2-canvas" aria-label="Green Krishi Schemes">

                <div className="s2-composition-wrapper">
                    <div className="s2-composition-drift">
                        {placedItems.map((item, i) => {
                            const isHovered   = hoveredId === item.id;
                            const isDimmed    = hoveredId !== null && !isHovered;
                            const depthScale  = DEPTH[i % DEPTH.length];

                            // Card width: 22% bigger across the board, 30% for primary
                            const scaledW = item.baseWidth.toFixed(0);

                            return (
                                /* LAYER 1: stationary hitbox */
                                <div
                                    key={item.id}
                                    className="s2-tile-hitbox"
                                    style={{ top: `${item.top}%`, left: `${item.left}%` } as React.CSSProperties}
                                >
                                    {/* LAYER 2: float animation - tiny individual variation variables */}
                                    <div
                                        className="s2-tile-float"
                                        style={{
                                            "--s2-float-dur":   `${item.floatDuration}s`,
                                            "--s2-float-delay": `${item.floatDelay}s`,
                                            "--s2-float-x-raw": `${item.floatX}px`,
                                            "--s2-float-y-raw": `${item.floatY}px`,
                                            "--s2-float-rot-raw":`${item.floatRotate}deg`,
                                            "--s2-stagger":     `${i * 35}ms`,
                                        } as React.CSSProperties}
                                    >
                                        {/* LAYER 3: enter stagger */}
                                        <div className="s2-tile-enter">
                                            {/* LAYER 4: clickable tile */}
                                            <button
                                                type="button"
                                                className={[
                                                    "s2-tile",
                                                    isDimmed  ? "s2-tile--dimmed"  : "",
                                                    isHovered ? "s2-tile--hovered" : "",
                                                    item.isPrimary ? "s2-tile--primary" : "",
                                                ].join(" ").trim()}
                                                style={{
                                                    "--s2-base-w":      `${scaledW}px`,
                                                    "--s2-rotate":      `${item.rotate}deg`,
                                                    "--s2-depth-scale": `${depthScale}`,
                                                } as React.CSSProperties}
                                                onMouseEnter={(e) => handleEnter(item, e)}
                                                onMouseMove={handleMove}
                                                onMouseLeave={handleLeave}
                                                onClick={(e) => handleTileClick(item, e)}
                                            >
                                                {/* ── Premium card — illustration + name + desc + arrow ── */}
                                                <div className="s2-card">
                                                    {/* Orange accent strip on primary */}
                                                    {item.isPrimary && (
                                                        <div className="s2-card-primary-strip" />
                                                    )}

                                                    {/* Illustration */}
                                                    <div className="s2-card-img-wrap">
                                                        <img
                                                            src={item.src}
                                                            alt={item.title}
                                                            className="s2-card-img"
                                                            loading="lazy"
                                                            draggable={false}
                                                        />
                                                    </div>

                                                    {/* Scheme info */}
                                                    <div className="s2-card-body">
                                                        <span className="s2-card-caption">{item.caption}</span>
                                                        <h3 className="s2-card-title">{item.title}</h3>
                                                        <p className="s2-card-desc">{item.desc}</p>
                                                    </div>

                                                    {/* Arrow */}
                                                    <div className="s2-card-footer">
                                                        <span className="s2-card-arrow">-&gt;</span>
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

                {/* Ambient glow anchors the heading composition */}
                <div className="s2-heading-ambient" aria-hidden="true" />

                {/* Centre heading */}
                <div className="s2-heading" aria-hidden={hoveredId !== null}>
                    <p className="s2-heading-eyebrow">Bank of Baroda · Green Krishi Initiative</p>
                    <h2 className="s2-heading-title">
                        Explore <span className="s2-orange">Sustainable</span><br />
                        Banking Solutions
                    </h2>
                    <p className="s2-heading-body">
                        Discover Bank of Baroda's behavioural banking<br />
                        initiatives designed to create long-term impact.
                    </p>
                    <p className="s2-heading-sub">Hover to Preview · Click to Explore</p>
                </div>
            </div>

            {/* Tooltip — functionality unchanged */}
            <div ref={tooltipRef} className="s2-tooltip" />
        </section>
    );
};
