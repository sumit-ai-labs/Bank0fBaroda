import { useEffect, useRef, useCallback, useState } from "react";
import { PlatformNavbar } from "../components/PlatformNavbar/PlatformNavbar";
import { Hero } from "../features/hero/Hero";
import { HeroIntro } from "../features/hero/components/HeroIntro";
import { Schemes } from "../features/schemes/Schemes";
import { GreenKrishi } from "../features/greenKrishi/GreenKrishi";
import { BehaviorCards } from "../features/behaviorCards/BehaviorCards";
import { Behaviour } from "../features/behaviour/Behaviour";
import { MicroActions } from "../features/behaviour/MicroActions";
import { EngagementHub } from "../features/engagementHub/EngagementHub";
import { Outreach } from "../features/outreach/Outreach";
import { OutreachVideoHub } from "../features/outreach/OutreachVideoHub";
import { useSectionNavigation } from "../hooks/useSectionNavigation";
import type { PlacedItem } from "../data/landing/schemes";
import "./Mainpage.css";

interface TransitionState {
    src: string;
    title: string;
    deltaX: number;
    deltaY: number;
    scaleX: number;
    scaleY: number;
    rotate: number;
    isPlaying: boolean;
    opacity: number;
}

export default function Mainpage() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const s3ClickTriggered = useRef(false);
    const isTransitioningRef = useRef(false);
    const [isIntroComplete, setIsIntroComplete] = useState(false);
    const [selectedBehavior, setSelectedBehavior] = useState("Farm Discipline");
    const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);

    const [pageStatus, setPageStatus] = useState<
        "idle" | "transition-zoom" | "transition-fade" | "video-playing" | "cross-fading" | "completed"
    >("idle");
    const [transitionState, setTransitionState] = useState<TransitionState | null>(null);

    const {
        activeSection,
        setActiveSection,
        currentSectionRef,
        scrollToSection,
        collapsedIndices,
    } = useSectionNavigation({
        scrollRef,
        totalSections: 9,
        manualOnlySection: 5,
        s3ClickTriggered,
        isTransitioningRef,
    });

    // Preload Section 3 logo/card assets
    useEffect(() => {
        const img1 = new Image();
        img1.src = "/assets/boblogo.png";
        const img3 = new Image();
        img3.src = "/assets/logo.png";
    }, []);

    // Reset pageStatus to 'idle' when user navigates back to Hero (0) or Schemes (1)
    // so that clicking any scheme card again re-triggers the video transition.
    useEffect(() => {
        if (activeSection < 2 && pageStatus !== "idle") {
            setPageStatus("idle");
        }
    }, [activeSection, pageStatus]);

    const handleSchemeClick = useCallback((item: PlacedItem, rect: DOMRect) => {
        if (isTransitioningRef.current || pageStatus !== "idle") return;

        setTransitionState({
            src: item.src,
            title: item.title,
            deltaX: rect.left,
            deltaY: rect.top,
            scaleX: rect.width / window.innerWidth,
            scaleY: rect.height / window.innerHeight,
            rotate: item.rotate,
            isPlaying: false,
            opacity: 1,
        });

        isTransitioningRef.current = true;
        setPageStatus("transition-zoom");
        currentSectionRef.current = 2;

        const el = scrollRef.current;
        if (el) {
            // Instantly transition position to Section 3 (index 2) without smooth scroll
            el.style.scrollBehavior = "auto";
            el.scrollLeft = 2 * window.innerWidth;
            setActiveSection(2);
            s3ClickTriggered.current = true;
            setTimeout(() => {
                if (el) el.style.scrollBehavior = "";
            }, 50);
        }

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                setTransitionState((prev) => {
                    if (!prev) return null;
                    return {
                        ...prev,
                        isPlaying: true,
                    };
                });
            });
        });

        setTimeout(() => {
            setPageStatus("transition-fade");
            setTransitionState((prev) => {
                if (!prev) return null;
                return {
                    ...prev,
                    opacity: 0,
                };
            });

            setTimeout(() => {
                setPageStatus("video-playing");
                setTransitionState(null);
                isTransitioningRef.current = false;

                setTimeout(() => {
                    setPageStatus("cross-fading");

                    setTimeout(() => {
                        setPageStatus("completed");
                    }, 700);
                }, 5000);
            }, 600);
        }, 900);
    }, [pageStatus, scrollRef, setActiveSection, currentSectionRef]);

    const handleStart = useCallback(() => {
        scrollToSection(1);
    }, [scrollToSection]);

    const handleBehaviorCardSelect = useCallback((title: string) => {
        setSelectedBehavior(title);
        scrollToSection(4);
    }, [scrollToSection]);

    const handleMicroActionSelect = useCallback(() => {
        s3ClickTriggered.current = true;
        scrollToSection(5, { allowHub: "microactions" });
    }, [scrollToSection, s3ClickTriggered]);

    const handleEngagementSelect = useCallback(() => {
        s3ClickTriggered.current = true;
        scrollToSection(6, { allowHub: "engagement" });
    }, [scrollToSection, s3ClickTriggered]);

    const handleOutreachNavigate = useCallback(() => {
        s3ClickTriggered.current = true;
        scrollToSection(7, { allowHub: "outreach" });
    }, [scrollToSection, s3ClickTriggered]);

    const handleVideoSelect = useCallback((id: string) => {
        setSelectedVideoId(id);
        s3ClickTriggered.current = true;
        scrollToSection(8, { allowHub: "outreachvideo" });
    }, [scrollToSection, s3ClickTriggered]);

    const handleBackToOutreach = useCallback(() => {
        s3ClickTriggered.current = true;
        scrollToSection(7);
    }, [scrollToSection, s3ClickTriggered]);

    const handleBackToEngagement = useCallback(() => {
        s3ClickTriggered.current = true;
        scrollToSection(4);
    }, [scrollToSection, s3ClickTriggered]);

    const handleBackToMicroActions = useCallback(() => {
        s3ClickTriggered.current = true;
        scrollToSection(4);
    }, [scrollToSection, s3ClickTriggered]);

    return (
        <div className="mainpage-root-wrapper">
            <PlatformNavbar currentSection={activeSection} />

            {!isIntroComplete && (
                <HeroIntro onComplete={() => setIsIntroComplete(true)} />
            )}

            <div 
                className={`h-scroll-container ${
                    pageStatus === "transition-zoom" || pageStatus === "transition-fade" 
                        ? "h-scroll-container--locked" 
                        : ""
                }`} 
                ref={scrollRef}
            >
                {/* Section 1 - Hero */}
                <div className={collapsedIndices.has(0) ? "section--collapsed" : ""}>
                    <Hero 
                        onStart={handleStart} 
                        isIntroComplete={isIntroComplete} 
                    />
                </div>

                {/* Section 2 - Scheme Scatter Grid */}
                <div className={collapsedIndices.has(1) ? "section--collapsed" : ""}>
                    <Schemes 
                        onSchemeClick={handleSchemeClick} 
                        isTransitioning={isTransitioningRef.current} 
                    />
                </div>

                {/* Section 3 - Video & Cards Transition */}
                <div className={collapsedIndices.has(2) ? "section--collapsed" : ""}>
                    <GreenKrishi pageStatus={pageStatus} />
                </div>

                {/* Section 4 - Behaviour Cards */}
                <div className={collapsedIndices.has(3) ? "section--collapsed" : ""}>
                    <BehaviorCards
                        isActive={activeSection === 3}
                        onCardSelect={handleBehaviorCardSelect}
                    />
                </div>

                {/* Section 5 - Behaviour Detail */}
                <div className={collapsedIndices.has(4) ? "section--collapsed" : ""}>
                    <Behaviour
                        selectedBehavior={selectedBehavior}
                        onEngagementSelect={handleEngagementSelect}
                        onMicroActionSelect={handleMicroActionSelect}
                        onOutreachSelect={handleOutreachNavigate}
                    />
                </div>

                {/* Section 6 - Micro Actions */}
                <div className={collapsedIndices.has(5) ? "section--collapsed" : ""}>
                    <MicroActions onBack={handleBackToMicroActions} />
                </div>

                {/* Section 7 - Engagement Hub */}
                <div className={collapsedIndices.has(6) ? "section--collapsed" : ""}>
                    <EngagementHub
                        onOutreachClick={handleOutreachNavigate}
                        onBack={handleBackToEngagement}
                    />
                </div>

                {/* Section 8 - Outreach Video Library */}
                <div className={collapsedIndices.has(7) ? "section--collapsed" : ""}>
                    <Outreach onVideoSelect={handleVideoSelect} />
                </div>

                {/* Section 9 - Outreach Video Hub */}
                <div className={collapsedIndices.has(8) ? "section--collapsed" : ""}>
                    <OutreachVideoHub
                        initialVideoId={selectedVideoId}
                        onBack={handleBackToOutreach}
                    />
                </div>
            </div>

            {/* Cinematic zoom transition image overlay */}
            {transitionState && (
                <div 
                    className="s2-zoom-overlay" 
                    style={{ 
                        opacity: transitionState.opacity,
                    }}
                >
                    <div 
                        className="s2-zoom-outer"
                        style={{
                            transform: transitionState.isPlaying 
                                ? "translate3d(0, 0, 0)" 
                                : `translate3d(${transitionState.deltaX}px, 0, 0)`,
                        }}
                    >
                        <div 
                            className="s2-zoom-inner"
                            style={{
                                transform: transitionState.isPlaying 
                                    ? "translate3d(0, 0, 0) scale(1) rotate(0deg)" 
                                    : `translate3d(0, ${transitionState.deltaY}px, 0) scale(${transitionState.scaleX}, ${transitionState.scaleY}) rotate(${transitionState.rotate}deg)`,
                                borderRadius: transitionState.isPlaying ? "0px" : "12px",
                            }}
                        >
                            <img 
                                src={transitionState.src} 
                                className="s2-zoom-image" 
                                alt={transitionState.title} 
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
