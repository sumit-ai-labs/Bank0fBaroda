import React, { useMemo, useState } from "react";
import { SCHEME_ITEMS } from "../../data/landing/schemes";
import { BackgroundNodes } from "../../shared/BackgroundNodes/BackgroundNodes";
import "./EngagementHub.css";

interface HubTab {
    id: string;
    nav: string;
    leftLines: string[];
    checklist: string[];
    cta: string;
    imageIndex: number;
    title: string;
    description: string;
    meta: string[];
    action: string;
}

const hubTabs: HubTab[] = [
    {
        id: "learn",
        nav: "Learn & Grow",
        leftLines: ["IS YOUR FARM", "READY FOR THE", "NEXT SEASON?"],
        checklist: ["Crop selected", "Budget prepared", "Water source identified", "Loan requirement assessed"],
        cta: "Interactive Activity",
        imageIndex: 6,
        title: "Learn & Grow",
        description: "Watch short videos on sustainable farming, financial planning, and digital agriculture.",
        meta: ["Short videos", "Farm planning", "Digital agriculture"],
        action: "Start Learning",
    },
    {
        id: "quiz",
        nav: "Knowledge Quiz",
        leftLines: ["TEST", "YOUR", "KNOWLEDGE"],
        checklist: ["Green Krishi basics", "Soil health", "Irrigation choices", "Banking schemes"],
        cta: "Begin Assessment",
        imageIndex: 3,
        title: "Knowledge Quiz",
        description: "Answer simple questions about Green Krishi, soil health, irrigation, and banking schemes.",
        meta: ["8 Questions", "Simple answers", "Instant feedback"],
        action: "Begin Quiz",
    },
    {
        id: "stories",
        nav: "Farmer Success Stories",
        leftLines: ["LEARN", "FROM", "FARMERS"],
        checklist: ["Real journeys", "Local examples", "Practical changes", "Visible outcomes"],
        cta: "Explore Stories",
        imageIndex: 4,
        title: "Success Stories",
        description: "Explore real stories of farmers who improved productivity using Green Krishi solutions.",
        meta: ["Story 01", "Story 02", "Story 03"],
        action: "View Stories",
    },
    {
        id: "rewards",
        nav: "Rewards",
        leftLines: ["EARN", "GREEN", "POINTS"],
        checklist: ["Complete milestones", "Build good habits", "Earn recognition", "Share progress"],
        cta: "Open Rewards",
        imageIndex: 9,
        title: "Rewards & Recognition",
        description: "Earn badges, certificates, and recognition for completing behavioural milestones.",
        meta: ["Badges", "Certificates", "Green Points"],
        action: "See Rewards",
    },
    {
        id: "progress",
        nav: "Progress Dashboard",
        leftLines: ["TRACK", "YOUR", "JOURNEY"],
        checklist: ["Cards completed", "Points earned", "Badges unlocked", "Next action ready"],
        cta: "View Progress",
        imageIndex: 8,
        title: "Progress Dashboard",
        description: "Track completed behaviour cards, Green Points, badges, and farming progress.",
        meta: ["4 Cards completed", "320 Green Points", "3 Badges"],
        action: "Open Dashboard",
    },
];

interface EngagementHubProps {
    onOutreachClick?: () => void;
    onBack?: () => void;
}

export const EngagementHub: React.FC<EngagementHubProps> = ({ onOutreachClick, onBack }) => {
    const [activeId, setActiveId] = useState(hubTabs[0].id);

    const activeTab = useMemo(
        () => hubTabs.find((tab) => tab.id === activeId) ?? hubTabs[0],
        [activeId],
    );

    return (
        <section className="engagement-hub-section" aria-labelledby="engagement-hub-title">
            <BackgroundNodes density={0.08} position="corners" opacity={0.1} />
            <div className="engagement-hub-watermark" aria-hidden="true">ENGAGEMENT</div>

            <div className="engagement-hub-shell">
                <aside className="engagement-left-panel" key={`left-${activeTab.id}`}>
                    <p className="engagement-eyebrow">Interactive Activity</p>
                    <h2 id="engagement-hub-title" className="engagement-left-title">
                        {activeTab.leftLines.map((line, index) => (
                            <span
                                key={line}
                                style={{ "--engagement-idx": index } as React.CSSProperties}
                            >
                                {line}
                            </span>
                        ))}
                    </h2>

                    <div className="engagement-checklist" aria-label={`${activeTab.nav} checklist`}>
                        {activeTab.checklist.map((item, index) => (
                            <span
                                key={item}
                                className="engagement-check-item"
                                style={{ "--engagement-idx": index } as React.CSSProperties}
                            >
                                <i aria-hidden="true" />
                                {item}
                            </span>
                        ))}
                    </div>

                    <button type="button" className="engagement-connect-cta">
                        Connect to Expert
                        <span aria-hidden="true">-&gt;</span>
                    </button>

                    {onOutreachClick && (
                        <button
                            type="button"
                            className="engagement-outreach-cta"
                            onClick={onOutreachClick}
                        >
                            Explore Outreach Videos
                            <span aria-hidden="true">-&gt;</span>
                        </button>
                    )}

                    {onBack && (
                        <button
                            type="button"
                            className="engagement-outreach-cta"
                            onClick={onBack}
                            style={{
                                borderColor: "rgba(235, 101, 37, 0.28)",
                                background: "rgba(235, 101, 37, 0.06)",
                                marginTop: "10px"
                            } as React.CSSProperties}
                        >
                            <span aria-hidden="true" style={{ color: "var(--color-accent-orange)" }}>&lt;-</span>
                            Back to Behaviour
                        </button>
                    )}
                </aside>

                <div className="engagement-right-panel">
                    <nav className="engagement-tabs" aria-label="Engagement hub sections">
                        {hubTabs.map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                className={`engagement-tab ${tab.id === activeId ? "engagement-tab--active" : ""}`}
                                onClick={() => setActiveId(tab.id)}
                            >
                                {tab.nav}
                            </button>
                        ))}
                    </nav>

                    <article className="engagement-content-card" key={`content-${activeTab.id}`}>
                        <div className="engagement-image-frame">
                            <img
                                src={SCHEME_ITEMS[activeTab.imageIndex]?.src ?? SCHEME_ITEMS[0].src}
                                alt=""
                                draggable={false}
                            />
                        </div>

                        <div className="engagement-content-copy">
                            <p>{activeTab.nav}</p>
                            <h3>{activeTab.title}</h3>
                            <span>{activeTab.description}</span>

                            <div className="engagement-meta-row">
                                {activeTab.meta.map((item) => (
                                    <em key={item}>{item}</em>
                                ))}
                            </div>

                            {activeTab.id === "progress" && (
                                <div className="engagement-progress" aria-label="Progress completion">
                                    <span><b style={{ width: "68%" }} /></span>
                                    <strong>68% completed</strong>
                                </div>
                            )}

                            {activeTab.id === "stories" && (
                                <div className="engagement-story-dots" aria-hidden="true">
                                    <i />
                                    <i />
                                    <i />
                                </div>
                            )}

                            <button type="button" className="engagement-secondary-cta">
                                {activeTab.action}
                                <span aria-hidden="true">-&gt;</span>
                            </button>
                        </div>
                    </article>
                </div>
            </div>
        </section>
    );
};
