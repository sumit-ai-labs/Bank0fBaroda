import React, { useCallback, useEffect, useRef } from "react";
import { SCHEME_ITEMS } from "../../data/landing/schemes";
import { BackgroundNodes } from "../../shared/BackgroundNodes/BackgroundNodes";

import "./Behaviour.css";

interface BehaviourProps {
    selectedBehavior?: string;
    onEngagementSelect?: () => void;
    onMicroActionSelect?: () => void;
    onOutreachSelect?: () => void;
}

interface BehaviourDetail {
    title: string;
    subtitle: string;
    watermark: string;
    imageIndex: number;
}

const behaviourDetails: Record<string, BehaviourDetail> = {
    "Farm Discipline": {
        title: "Farm Discipline",
        subtitle: "Plan Before Planting",
        watermark: "DISCIPLINE",
        imageIndex: 6,
    },
    "Digital Agriculture": {
        title: "Digital Agriculture",
        subtitle: "Tools With Confidence",
        watermark: "DIGITAL",
        imageIndex: 1,
    },
    "Farm Investment": {
        title: "Farm Investment",
        subtitle: "Invest With Clarity",
        watermark: "INVESTMENT",
        imageIndex: 8,
    },
    "Market Linkage": {
        title: "Market Linkage",
        subtitle: "Connect To Markets",
        watermark: "MARKET",
        imageIndex: 4,
    },
    "Green Mindset": {
        title: "Green Mindset",
        subtitle: "Grow Sustainably",
        watermark: "GREEN",
        imageIndex: 9,
    },
    "Financial Wisdom": {
        title: "Financial Wisdom",
        subtitle: "Plan Money Better",
        watermark: "FINANCE",
        imageIndex: 0,
    },
};

const contentCards = [
    {
        heading: "Behaviour Objective",
        body: "Encourage farmers to prepare a crop plan before every farming season to improve productivity, resource utilization, and financial planning.",
    },
    {
        heading: "Why This Matters",
        body: "Planning helps farmers choose the right crop, estimate expenses, arrange finance, and reduce avoidable risks before sowing begins.",
    },
    {
        heading: "Micro Behaviour",
        body: "Prepare a simple crop plan before purchasing seeds, fertilizers, or other farming inputs.",
    },
    {
        heading: "Bank Linkage",
        body: "Use Bank of Baroda Green Krishi solutions to access crop finance, advisory services, and digital planning tools for better farm management.",
    },
];

const esgItems = [
    "Better resource management",
    "Reduced input wastage",
    "Improved financial discipline",
    "Sustainable farming practices",
];

const actionCards = [
    {
        label: "Engagement",
        text: "Create farmer-facing prompts that make seasonal planning feel simple.",
        icon: "E",
    },
    {
        label: "Outreach",
        text: "Translate this behaviour into local field conversations and support.",
        icon: "O",
    },
    {
        label: "Micro Action",
        text: "Define the smallest planning step before the next crop cycle.",
        icon: "M",
    },
];

/* ─── Behaviour ──────────────────────────────────────────────────────────── */
export const Behaviour: React.FC<BehaviourProps> = ({
    selectedBehavior = "Farm Discipline",
    onEngagementSelect,
    onMicroActionSelect,
    onOutreachSelect,
}) => {
    const sectionRef = useRef<HTMLElement>(null);
    const rightPanelRef = useRef<HTMLDivElement>(null);

    const detail = behaviourDetails[selectedBehavior] ?? behaviourDetails["Farm Discipline"];
    const [firstWord, ...remainingWords] = detail.title.split(" ");
    const secondLine = remainingWords.join(" ");
    const imageSrc = SCHEME_ITEMS[detail.imageIndex]?.src ?? SCHEME_ITEMS[0].src;
    const scrollRightPanel = useCallback((amount: number) => {
        const panel = rightPanelRef.current;
        if (!panel || window.matchMedia("(max-width: 1060px)").matches) return false;

        const maxScroll = panel.scrollHeight - panel.clientHeight;
        if (maxScroll <= 0) return false;

        const nextScroll = Math.min(maxScroll, Math.max(0, panel.scrollTop + amount));
        if (nextScroll === panel.scrollTop) return false;

        panel.scrollTop = nextScroll;
        return true;
    }, []);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const handleNativeWheel = (event: WheelEvent) => {
            if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
            if (window.matchMedia("(max-width: 1060px)").matches) return;

            event.preventDefault();
            scrollRightPanel(event.deltaY);
        };

        section.addEventListener("wheel", handleNativeWheel, { passive: false, capture: true });

        return () => {
            section.removeEventListener("wheel", handleNativeWheel, { capture: true });
        };
    }, [scrollRightPanel]);

    const handleWheel = useCallback((event: React.WheelEvent<HTMLElement>) => {
        if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
        if (window.matchMedia("(max-width: 1060px)").matches) return;

        event.preventDefault();
        scrollRightPanel(event.deltaY);
    }, [scrollRightPanel]);

    const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLElement>) => {
        const keyScroll: Record<string, number> = {
            ArrowDown: 72,
            ArrowUp: -72,
            PageDown: 420,
            PageUp: -420,
        };
        const amount = keyScroll[event.key];
        if (amount && !window.matchMedia("(max-width: 1060px)").matches) {
            event.preventDefault();
            scrollRightPanel(amount);
        }
    }, [scrollRightPanel]);

    return (
        <section
            className="behaviour-detail-section"
            aria-labelledby="behaviour-detail-title"
            tabIndex={0}
            ref={sectionRef}
            onWheel={handleWheel}
            onKeyDown={handleKeyDown}
        >
            <BackgroundNodes density={0.08} position="corners" opacity={0.1} />
            <div className="behaviour-detail-watermark" aria-hidden="true">
                {detail.watermark}
            </div>

            <div className="behaviour-detail-shell" key={detail.title}>
                <aside className="behaviour-detail-left" aria-label={`${detail.title} visual summary`}>
                    <div className="behaviour-detail-image-frame">
                        <img src={imageSrc} alt="" className="behaviour-detail-image" draggable={false} />
                    </div>

                    <div className="behaviour-detail-identity">
                        <p>Behaviour Insight Report</p>
                        <h2 id="behaviour-detail-title">
                            <span>{firstWord}</span>
                            {secondLine && <span>{secondLine}</span>}
                        </h2>
                        <strong>{detail.subtitle}</strong>
                    </div>
                </aside>

                <div className="behaviour-detail-right" ref={rightPanelRef}>
                    <div className="behaviour-detail-kicker">Bank of Baroda / Green Krishi</div>

                    {contentCards.map((card, index) => (
                        <article
                            className="behaviour-detail-card"
                            style={{ "--detail-idx": index } as React.CSSProperties}
                            key={card.heading}
                        >
                            <h3>{card.heading}</h3>
                            <p>{card.body}</p>
                        </article>
                    ))}

                    <article
                        className="behaviour-detail-card behaviour-detail-card--esg"
                        style={{ "--detail-idx": 4 } as React.CSSProperties}
                    >
                        <h3>ESG Impact</h3>
                        <div className="behaviour-esg-grid">
                            {esgItems.map((item) => (
                                <span key={item} className="behaviour-esg-item">
                                    <span className="behaviour-esg-mark" aria-hidden="true" />
                                    {item}
                                </span>
                            ))}
                        </div>
                    </article>

                    <article
                        className="behaviour-reflection-card"
                        style={{ "--detail-idx": 5 } as React.CSSProperties}
                    >
                        <span aria-hidden="true">"</span>
                        <p>How did planning improve your farming decisions this season?</p>
                    </article>

                    <nav
                        className="behaviour-action-grid"
                        aria-label="Behaviour insight actions"
                        style={{ "--detail-idx": 6 } as React.CSSProperties}
                    >
                        {actionCards.map((action) => (
                            <button
                                type="button"
                                className="behaviour-action-card"
                                key={action.label}
                                onClick={
                                    action.label === "Engagement"
                                        ? onEngagementSelect
                                        : action.label === "Micro Action"
                                        ? onMicroActionSelect
                                        : action.label === "Outreach"
                                        ? onOutreachSelect
                                        : undefined
                                }
                            >
                                <span className="behaviour-action-icon" aria-hidden="true">
                                    {action.icon}
                                </span>
                                <span>
                                    <strong>{action.label}</strong>
                                    <em>{action.text}</em>
                                </span>
                                <i aria-hidden="true">-&gt;</i>
                            </button>
                        ))}
                    </nav>
                </div>
            </div>
        </section>
    );
};
