import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { BackgroundNodes } from "../../shared/BackgroundNodes/BackgroundNodes";
import { OUTREACH_VIDEOS } from "./Outreach";
import "./OutreachVideoHub.css";

// ─────────────────────────────────────────────────────────────────────────────
// Enriched data – extends OUTREACH_VIDEOS with Hub-specific fields
// ─────────────────────────────────────────────────────────────────────────────

interface HubVideoData {
    id: string;
    /** Three-line animated left-panel heading */
    leftLines: string[];
    /** Four learning objectives shown as a checklist */
    objectives: string[];
}

const HUB_VIDEO_DATA: Record<string, HubVideoData> = {
    "v-financial-literacy": {
        id: "v-financial-literacy",
        leftLines: ["BANKING", "BASICS", "EXPLAINED"],
        objectives: [
            "Understanding bank schemes",
            "Assessing loan eligibility",
            "Digital payment adoption",
            "Budget planning for crops",
        ],
    },
    "v-digital-banking": {
        id: "v-digital-banking",
        leftLines: ["MOBILE", "BANKING", "FOR FARMS"],
        objectives: [
            "Setting up mobile banking",
            "UPI for farm transactions",
            "Account self-management",
            "Secure digital practices",
        ],
    },
    "v-green-krishi": {
        id: "v-green-krishi",
        leftLines: ["FARMER", "SUCCESS", "STORIES"],
        objectives: [
            "Improved crop yields",
            "Higher farm income",
            "Sustainable transitions",
            "Peer learning techniques",
        ],
    },
    "v-crop-loan": {
        id: "v-crop-loan",
        leftLines: ["CROP LOAN", "STEP BY", "STEP"],
        objectives: [
            "Required documentation",
            "Checking eligibility",
            "Submitting applications",
            "Tracking approval status",
        ],
    },
    "v-insurance": {
        id: "v-insurance",
        leftLines: ["PROTECT", "YOUR", "HARVEST"],
        objectives: [
            "PMFBY scheme overview",
            "Filing a claim correctly",
            "Understanding coverage",
            "Risk management basics",
        ],
    },
    "v-market-connect": {
        id: "v-market-connect",
        leftLines: ["MARKET", "CONNECT", "FOR FARMS"],
        objectives: [
            "Finding reliable buyers",
            "Understanding market price",
            "Using digital marketplaces",
            "Negotiation fundamentals",
        ],
    },
    "v-soil-health": {
        id: "v-soil-health",
        leftLines: ["SOIL", "HEALTH", "MGMT"],
        objectives: [
            "Nutrient testing methods",
            "Organic farming practices",
            "Long-term yield strategies",
            "Reducing chemical inputs",
        ],
    },
    "v-water-conservation": {
        id: "v-water-conservation",
        leftLines: ["WATER", "WISE", "FARMING"],
        objectives: [
            "Drip irrigation setup",
            "Rainwater harvesting",
            "Water budgeting per crop",
            "Sensor-based irrigation",
        ],
    },
};

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────

interface OutreachVideoHubProps {
    /** ID of the video that was clicked to open the Hub */
    initialVideoId?: string | null;
    /** Callback to navigate back to the Outreach scatter section */
    onBack?: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export const OutreachVideoHub: React.FC<OutreachVideoHubProps> = ({
    initialVideoId,
    onBack,
}) => {
    // Resolve initial video; fall back to the first in the list
    const defaultId = initialVideoId ?? OUTREACH_VIDEOS[0].id;
    const [activeId, setActiveId] = useState(defaultId);
    const [isSwitching, setIsSwitching] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Sync active video when the parent changes `initialVideoId`
    useEffect(() => {
        if (initialVideoId && initialVideoId !== activeId) {
            handleTabClick(initialVideoId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialVideoId]);

    const activeVideo = useMemo(
        () => OUTREACH_VIDEOS.find((v) => v.id === activeId) ?? OUTREACH_VIDEOS[0],
        [activeId],
    );

    const hubData = HUB_VIDEO_DATA[activeId] ?? HUB_VIDEO_DATA[OUTREACH_VIDEOS[0].id];

    // Smooth tab switching: briefly overlay the video with a dark fade
    const handleTabClick = useCallback((id: string) => {
        if (id === activeId) return;
        setIsSwitching(true);
        setTimeout(() => {
            setActiveId(id);
            setIsSwitching(false);
            // Allow the video element to reload and autoplay
            requestAnimationFrame(() => {
                if (videoRef.current) {
                    videoRef.current.currentTime = 0;
                    videoRef.current.play().catch(() => {/* autoplay policy – silent fail */});
                }
            });
        }, 240);
    }, [activeId]);

    return (
        <section className="ovh-section" aria-labelledby="ovh-title">
            <BackgroundNodes density={0.08} position="corners" opacity={0.1} />
            <div className="ovh-watermark" aria-hidden="true">OUTREACH</div>

            <div className="ovh-shell">
                {/* ── Left panel ────────────────────────────────────────── */}
                <aside className="ovh-left" key={`left-${activeId}`}>
                    <p className="ovh-eyebrow">Bank of Baroda · Green Krishi Outreach</p>

                    <h2 id="ovh-title" className="ovh-left-title">
                        {hubData.leftLines.map((line, i) => (
                            <span
                                key={line}
                                style={{ "--ovh-idx": i } as React.CSSProperties}
                            >
                                {line}
                            </span>
                        ))}
                    </h2>

                    <div className="ovh-checklist" aria-label="Learning objectives">
                        {hubData.objectives.map((obj, i) => (
                            <span
                                key={obj}
                                className="ovh-check-item"
                                style={{ "--ovh-idx": i } as React.CSSProperties}
                            >
                                <i aria-hidden="true" />
                                {obj}
                            </span>
                        ))}
                    </div>

                    <button
                        type="button"
                        className="ovh-cta-connect"
                    >
                        Connect to Expert
                        <span aria-hidden="true">-&gt;</span>
                    </button>

                    {onBack && (
                        <button
                            type="button"
                            className="ovh-cta-back"
                            onClick={onBack}
                        >
                            <span aria-hidden="true">&lt;-</span>
                            Back to Video Library
                        </button>
                    )}
                </aside>

                {/* ── Right panel ───────────────────────────────────────── */}
                <div className="ovh-right">
                    {/* Tabs — all videos */}
                    <nav className="ovh-tabs" aria-label="Outreach video library">
                        {OUTREACH_VIDEOS.map((video) => (
                            <button
                                key={video.id}
                                type="button"
                                className={`ovh-tab ${video.id === activeId ? "ovh-tab--active" : ""}`}
                                onClick={() => handleTabClick(video.id)}
                            >
                                {video.caption}
                            </button>
                        ))}
                    </nav>

                    {/* Content card */}
                    <article
                        className="ovh-content-card"
                        key={`content-${activeId}`}
                    >
                        {/* Video player */}
                        <div
                            className={`ovh-video-frame ${isSwitching ? "ovh-video-frame--switching" : ""}`}
                        >
                            <video
                                ref={videoRef}
                                className="ovh-video"
                                src="/assets/bankvideo.mp4"
                                muted
                                autoPlay
                                playsInline
                                loop
                                preload="auto"
                                aria-label={`Outreach video: ${activeVideo.title}`}
                            />
                        </div>

                        {/* Copy */}
                        <div className="ovh-copy">
                            <p className="ovh-copy-eyebrow">
                                {activeVideo.category}&nbsp;·&nbsp;{activeVideo.duration}
                            </p>
                            <h3>{activeVideo.title}</h3>
                            <span className="ovh-copy-desc">{activeVideo.desc}</span>

                            <div className="ovh-meta-row" aria-label="Topics covered">
                                {activeVideo.topics.map((topic) => (
                                    <em key={topic}>{topic}</em>
                                ))}
                            </div>

                            <button type="button" className="ovh-watch-cta">
                                Watch Full Video
                                <span aria-hidden="true">-&gt;</span>
                            </button>
                        </div>
                    </article>
                </div>
            </div>
        </section>
    );
};
