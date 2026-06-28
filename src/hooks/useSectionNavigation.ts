import { useState, useRef, useCallback, useEffect } from "react";

export interface UseSectionNavigationProps {
    scrollRef: React.RefObject<HTMLDivElement | null>;
    totalSections: number;
    manualOnlySection?: number;
    s3ClickTriggered: React.RefObject<boolean>;
    isTransitioningRef: React.RefObject<boolean>;
}

export interface ScrollToSectionOptions {
    allowManualOnly?: boolean;
    allowHub?: "microactions" | "engagement" | "outreach" | "outreachvideo";
}

const HUB_SECTIONS = new Set([5, 6, 7, 8]);

export function useSectionNavigation({
    scrollRef,
    s3ClickTriggered,
    isTransitioningRef,
}: UseSectionNavigationProps) {
    const [activeSection, setActiveSection] = useState(0);
    const currentSectionRef = useRef(0);
    const isScrollingH = useRef(false);
    
    // Core fix: Track last scroll transition timestamp to absorb trackpad momentum bursts
    const lastTransitionTimeRef = useRef<number>(0);
    const MOMENTUM_DELAY = 700; 

    const hubAccessGrantedRef = useRef<"none" | "microactions" | "engagement" | "outreach" | "outreachvideo">("none");
    const targetSectionRef = useRef(0);
    const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Touch tracking refs
    const touchStartX = useRef<number | null>(null);
    const touchStartY = useRef<number | null>(null);
    const touchIsHorizontal = useRef(false);

    const [collapsedIndices, setCollapsedIndices] = useState<Set<number>>(new Set());

    const getCollapsedSetForIndex = useCallback((index: number): Set<number> => {
        const set = new Set<number>();
        if (index > 4) {
            for (let i = 5; i < index; i++) {
                set.add(i);
            }
        }
        return set;
    }, []);

    // ── Single Source of Truth Navigation Router ──────────────────────────
    const handleNavigationRequest = useCallback((direction: "next" | "prev") => {
        const now = Date.now();
        if (now - lastTransitionTimeRef.current < MOMENTUM_DELAY) return;

        const current = currentSectionRef.current;
        const activeHub = hubAccessGrantedRef.current;
        let next = current;

        if (direction === "next") {
            if (current < 4) next = current + 1;
            else if (current === 4) {
                if (activeHub === "microactions") next = 5;
                if (activeHub === "engagement") next = 6;
                if (activeHub === "outreach") next = 7;
            }
            else if (current === 5 || current === 6 || current === 7) next = 4;
            else if (current === 8) next = 7;
        } else { // prev
            if (current <= 4) next = Math.max(current - 1, 0);
            else if (current === 5 || current === 6 || current === 7) next = 4;
            else if (current === 8) next = 7;
        }

        if (next === 2 && current < 2 && !s3ClickTriggered.current) return;
        if (next === current) return;

        if (next < 2) s3ClickTriggered.current = false;
        
        scrollToSection(next);
    }, [s3ClickTriggered]);

    // ── scrollToSection ────────────────────────────────────────────────────
    const scrollToSection = useCallback(
        (index: number, options?: ScrollToSectionOptions) => {
            const el = scrollRef.current;
            if (!el) return;

            // Set momentum time guard
            lastTransitionTimeRef.current = Date.now();

            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }

            isScrollingH.current = true;

            const oldGrant = hubAccessGrantedRef.current;
            if (options?.allowHub) {
                hubAccessGrantedRef.current = options.allowHub;
            } else {
                if (index <= 4) {
                    hubAccessGrantedRef.current = "none";
                } else if (index === 7) {
                    if (oldGrant === "outreachvideo" || oldGrant === "outreach") {
                        hubAccessGrantedRef.current = "outreach";
                    } else {
                        hubAccessGrantedRef.current = "none";
                    }
                }
            }

            targetSectionRef.current = index;
            currentSectionRef.current = index;
            setActiveSection(index);

            if (index <= 4) {
                el.scrollTo({ left: index * window.innerWidth, behavior: "smooth" });

                scrollTimeoutRef.current = setTimeout(() => {
                    setCollapsedIndices(new Set());
                    isScrollingH.current = false;
                }, 850);
            } else {
                const nextCollapsed = getCollapsedSetForIndex(index);
                setCollapsedIndices(nextCollapsed);

                requestAnimationFrame(() => {
                    el.scrollTo({ left: 5 * window.innerWidth, behavior: "smooth" });

                    scrollTimeoutRef.current = setTimeout(() => {
                        isScrollingH.current = false;
                    }, 850);
                });
            }
        },
        [scrollRef, getCollapsedSetForIndex],
    );

    // ── Wheel handler ──────────────────────────────────────────────────────
    const onWheel = useCallback(
        (e: WheelEvent) => {
            e.preventDefault();
            if (isScrollingH.current || isTransitioningRef.current) return;

            const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
            if (Math.abs(delta) < 15) return; // Increased deadzone threshold for cleaner wheel ticks

            handleNavigationRequest(delta > 0 ? "next" : "prev");
        },
        [isTransitioningRef, handleNavigationRequest],
    );

    // ── Keyboard handler ───────────────────────────────────────────────────
    const onKey = useCallback(
        (e: KeyboardEvent) => {
            if (isTransitioningRef.current) {
                e.preventDefault();
                return;
            }
            if (e.key === "ArrowRight") handleNavigationRequest("next");
            if (e.key === "ArrowLeft") handleNavigationRequest("prev");
        },
        [isTransitioningRef, handleNavigationRequest],
    );

    // ── Touch handlers ─────────────────────────────────────────────────────
    const onTouchStart = useCallback((e: TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
        touchIsHorizontal.current = false;
    }, []);

    const onTouchMove = useCallback((e: TouchEvent) => {
        if (touchStartX.current === null || touchStartY.current === null) return;
        const dx = e.touches[0].clientX - touchStartX.current;
        const dy = e.touches[0].clientY - touchStartY.current;

        if (!touchIsHorizontal.current) {
            if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 6) {
                let current = e.target as HTMLElement | null;
                let hasHorizontalScrollAncestor = false;
                while (current && current !== scrollRef.current) {
                    const style = window.getComputedStyle(current);
                    if ((style.overflowX === "auto" || style.overflowX === "scroll") && current.scrollWidth > current.clientWidth) {
                        hasHorizontalScrollAncestor = true;
                        break;
                    }
                    current = current.parentElement;
                }
                if (hasHorizontalScrollAncestor) {
                    touchStartX.current = null;
                    touchStartY.current = null;
                    return;
                }
                touchIsHorizontal.current = true;
            } else if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 6) {
                touchStartX.current = null;
                touchStartY.current = null;
                return;
            }
        }
        if (touchIsHorizontal.current) e.preventDefault();
    }, [scrollRef]);

    const onTouchEnd = useCallback((e: TouchEvent) => {
        const startX = touchStartX.current;
        touchStartX.current = null;
        touchStartY.current = null;
        const wasHorizontal = touchIsHorizontal.current;
        touchIsHorizontal.current = false;

        if (!wasHorizontal || startX === null) return;
        if (isScrollingH.current || isTransitioningRef.current) return;

        const dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) < 40) return; // Swipe distance threshold

        handleNavigationRequest(dx < 0 ? "next" : "prev");
    }, [isTransitioningRef, handleNavigationRequest]);

    // ── Scroll Listener Setup ───────────────────────────────────────────────
    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        const handleScroll = () => {
            const scrollLeft = el.scrollLeft;

            if (!s3ClickTriggered.current && scrollLeft > window.innerWidth) {
                el.scrollLeft = window.innerWidth;
                return;
            }

            if (isScrollingH.current) {
                const targetLeft = targetSectionRef.current <= 4
                    ? targetSectionRef.current * window.innerWidth
                    : 5 * window.innerWidth;

                if (Math.abs(scrollLeft - targetLeft) < 5) {
                    if (scrollTimeoutRef.current) {
                        clearTimeout(scrollTimeoutRef.current);
                        scrollTimeoutRef.current = null;
                    }
                    isScrollingH.current = false;
                } else {
                    return;
                }
            }

            if (isTransitioningRef.current) return;

            let rawIndex = 0;
            if (scrollLeft <= 4.2 * window.innerWidth) {
                rawIndex = Math.round(scrollLeft / window.innerWidth);
            } else {
                rawIndex = targetSectionRef.current;
            }

            if (rawIndex === 7 && currentSectionRef.current === 8 && hubAccessGrantedRef.current === "outreachvideo") {
                hubAccessGrantedRef.current = "outreach";
            }

            const currentGrant = hubAccessGrantedRef.current;
            const isHub = HUB_SECTIONS.has(rawIndex);

            let isAuthorized = false;
            if (isHub) {
                if (rawIndex === 5 && currentGrant === "microactions") isAuthorized = true;
                if (rawIndex === 6 && currentGrant === "engagement") isAuthorized = true;
                if (rawIndex === 7 && (currentGrant === "outreach" || currentGrant === "outreachvideo")) isAuthorized = true;
                if (rawIndex === 8 && currentGrant === "outreachvideo") isAuthorized = true;
            } else {
                isAuthorized = true;
            }

            if (isHub && !isAuthorized) {
                const snapTo = 4;
                if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
                isScrollingH.current = true;
                targetSectionRef.current = snapTo;
                el.scrollTo({ left: snapTo * window.innerWidth, behavior: "smooth" });
                currentSectionRef.current = snapTo;
                setActiveSection(snapTo);
                
                scrollTimeoutRef.current = setTimeout(() => {
                    setCollapsedIndices(new Set());
                    isScrollingH.current = false;
                }, 1400);
                return;
            }

            if (rawIndex !== currentSectionRef.current) {
                currentSectionRef.current = rawIndex;
                setActiveSection(rawIndex);

                if (rawIndex <= 4) {
                    setCollapsedIndices(new Set());
                    hubAccessGrantedRef.current = "none";
                }
            }
        };

        el.addEventListener("wheel", onWheel, { passive: false });
        el.addEventListener("scroll", handleScroll);
        el.addEventListener("touchstart", onTouchStart, { passive: true });
        el.addEventListener("touchmove", onTouchMove, { passive: false });
        el.addEventListener("touchend", onTouchEnd);
        window.addEventListener("keydown", onKey);

        return () => {
            el.removeEventListener("wheel", onWheel);
            el.removeEventListener("scroll", handleScroll);
            el.removeEventListener("touchstart", onTouchStart);
            el.removeEventListener("touchmove", onTouchMove);
            el.removeEventListener("touchend", onTouchEnd);
            window.removeEventListener("keydown", onKey);
            if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        };
    }, [scrollRef, onWheel, onKey, onTouchStart, onTouchMove, onTouchEnd, s3ClickTriggered, isTransitioningRef, collapsedIndices]);

    return {
        activeSection,
        setActiveSection,
        currentSectionRef,
        targetSectionRef,
        scrollToSection,
        collapsedIndices,
    };
}