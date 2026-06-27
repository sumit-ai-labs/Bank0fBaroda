import { useState, useRef, useCallback, useEffect } from "react";

export interface UseSectionNavigationProps {
    scrollRef: React.RefObject<HTMLDivElement | null>;
    totalSections: number;
    manualOnlySection?: number; // Kept for backward-compat
    s3ClickTriggered: React.RefObject<boolean>;
    isTransitioningRef: React.RefObject<boolean>;
}

export interface ScrollToSectionOptions {
    allowManualOnly?: boolean; // Kept for backward-compat
    allowHub?: "microactions" | "engagement" | "outreach" | "outreachvideo";
}

// Hub sections: only reachable via explicit click triggers.
const HUB_SECTIONS = new Set([5, 6, 7, 8]);

export function useSectionNavigation({
    scrollRef,
    s3ClickTriggered,
    isTransitioningRef,
}: UseSectionNavigationProps) {
    const [activeSection, setActiveSection] = useState(0);
    const currentSectionRef = useRef(0);
    const isScrollingH = useRef(false);

    // Track explicit hub navigation authorization state
    const hubAccessGrantedRef = useRef<"none" | "microactions" | "engagement" | "outreach" | "outreachvideo">("none");

    const targetSectionRef = useRef(0);
    const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Touch tracking refs — for mobile swipe navigation
    const touchStartX = useRef<number | null>(null);
    const touchStartY = useRef<number | null>(null);
    const touchIsHorizontal = useRef(false); // true once we've confirmed a horizontal swipe

    // Track intermediate sections to collapse during transition
    const [collapsedIndices, setCollapsedIndices] = useState<Set<number>>(new Set());

    // Helper to calculate which sections need to be collapsed for a given target index
    const getCollapsedSetForIndex = useCallback((index: number): Set<number> => {
        const set = new Set<number>();
        if (index > 4) {
            for (let i = 5; i < index; i++) {
                set.add(i);
            }
        }
        return set;
    }, []);

    // ── scrollToSection ────────────────────────────────────────────────────
    const scrollToSection = useCallback(
        (index: number, options?: ScrollToSectionOptions) => {
            const el = scrollRef.current;
            if (!el) return;

            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }

            isScrollingH.current = true;

            const oldGrant = hubAccessGrantedRef.current;
            if (options?.allowHub) {
                hubAccessGrantedRef.current = options.allowHub;
            } else {
                // Determine hub access grant changes during scrolls
                if (index <= 4) {
                    hubAccessGrantedRef.current = "none";
                } else if (index === 7) {
                    // Fall back to outreach if returning from outreachvideo
                    if (
                        oldGrant === "outreachvideo" ||
                        oldGrant === "outreach"
                    ) {
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
                // Moving back to main timeline: scroll smoothly to final position
                el.scrollTo({ left: index * window.innerWidth, behavior: "smooth" });

                scrollTimeoutRef.current = setTimeout(() => {
                    setCollapsedIndices(new Set());
                    isScrollingH.current = false;
                }, 850);
            } else {
                // Moving to a hub section (5, 6, 7, 8): collapse preceding sections
                const nextCollapsed = getCollapsedSetForIndex(index);
                setCollapsedIndices(nextCollapsed);

                // Wait one animation frame for DOM layout to update widths
                requestAnimationFrame(() => {
                    // With all preceding hub sections collapsed to 0 width,
                    // the target hub section resides exactly at visible index 5
                    el.scrollTo({ left: 5 * window.innerWidth, behavior: "smooth" });

                    scrollTimeoutRef.current = setTimeout(() => {
                        isScrollingH.current = false;
                    }, 850);
                });
            }
        },
        [scrollRef, getCollapsedSetForIndex],
    );

    // ── getScrollTarget ────────────────────────────────────────────────────
    const getScrollTarget = useCallback(
        (current: number, direction: "next" | "prev"): number => {
            const activeHub = hubAccessGrantedRef.current;

            if (direction === "next") {
                // Main timeline
                if (current < 4) {
                    return current + 1;
                }
                if (current === 4) {
                    // Only enter branch if explicitly selected
                    if (activeHub === "microactions") return 5;
                    if (activeHub === "engagement") return 6;
                    if (activeHub === "outreach") return 7;
                    return 4; // Blocked
                }
                // Branch sections
                if (current === 5 || current === 6) {
                    return 4; // Scroll right exits to Behaviour
                }
                if (current === 7) {
                    if (activeHub === "outreachvideo") return 8;
                    return 4; // Scroll right exits to Behaviour
                }
                if (current === 8) {
                    return 7; // Scroll right exits to video library
                }
                return current;
            } else { // prev
                if (current <= 4) {
                    return Math.max(current - 1, 0);
                }
                // Branch sections: scrolling left exits to parent Behaviour
                if (current === 5 || current === 6 || current === 7) {
                    return 4;
                }
                if (current === 8) {
                    return 7;
                }
                return current;
            }
        },
        [],
    );

    // ── Wheel handler ──────────────────────────────────────────────────────
    const onWheel = useCallback(
        (e: WheelEvent) => {
            e.preventDefault();
            const el = scrollRef.current;
            if (!el) return;
            if (isScrollingH.current || isTransitioningRef.current) return;

            const current = currentSectionRef.current;
            const delta =
                Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
            if (Math.abs(delta) < 5) return;

            const next = getScrollTarget(current, delta > 0 ? "next" : "prev");

            if (next === 2 && current < 2 && !s3ClickTriggered.current) return;
            if (next === current) return;

            if (next < 2) s3ClickTriggered.current = false;
            scrollToSection(next);
        },
        [scrollRef, s3ClickTriggered, isTransitioningRef, getScrollTarget, scrollToSection],
    );

    // ── Keyboard handler ───────────────────────────────────────────────────
    const onKey = useCallback(
        (e: KeyboardEvent) => {
            if (isTransitioningRef.current) {
                e.preventDefault();
                return;
            }
            const el = scrollRef.current;
            if (!el) return;

            const current = currentSectionRef.current;

            if (e.key === "ArrowRight") {
                const next = getScrollTarget(current, "next");
                if (next === 2 && current < 2 && !s3ClickTriggered.current) return;
                if (next === current) return;
                if (next < 2) s3ClickTriggered.current = false;
                scrollToSection(next);
            }
            if (e.key === "ArrowLeft") {
                const next = getScrollTarget(current, "prev");
                if (next < 2) s3ClickTriggered.current = false;
                scrollToSection(next);
            }
        },
        [scrollRef, s3ClickTriggered, isTransitioningRef, getScrollTarget, scrollToSection],
    );

    // ── Touch handlers ─────────────────────────────────────────────────────
    const onTouchStart = useCallback(
        (e: TouchEvent) => {
            touchStartX.current = e.touches[0].clientX;
            touchStartY.current = e.touches[0].clientY;
            touchIsHorizontal.current = false;
        },
        [],
    );

    const onTouchMove = useCallback(
        (e: TouchEvent) => {
            if (touchStartX.current === null || touchStartY.current === null) return;
            const dx = e.touches[0].clientX - touchStartX.current;
            const dy = e.touches[0].clientY - touchStartY.current;
            if (!touchIsHorizontal.current) {
                if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 6) {
                    touchIsHorizontal.current = true;
                } else if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 6) {
                    // Clearly vertical — let the browser handle it
                    touchStartX.current = null;
                    touchStartY.current = null;
                    return;
                }
            }
            // Suppress native horizontal scroll-snap when we've taken control
            if (touchIsHorizontal.current) e.preventDefault();
        },
        [],
    );

    const onTouchEnd = useCallback(
        (e: TouchEvent) => {
            const startX = touchStartX.current;
            touchStartX.current = null;
            touchStartY.current = null;
            const wasHorizontal = touchIsHorizontal.current;
            touchIsHorizontal.current = false;

            if (!wasHorizontal || startX === null) return;
            if (isScrollingH.current || isTransitioningRef.current) return;

            const dx = e.changedTouches[0].clientX - startX;
            if (Math.abs(dx) < 30) return; // minimum swipe threshold

            const current = currentSectionRef.current;
            const direction = dx < 0 ? "next" : "prev";
            const next = getScrollTarget(current, direction);

            if (next === 2 && current < 2 && !s3ClickTriggered.current) return;
            if (next === current) return;

            if (next < 2) s3ClickTriggered.current = false;
            scrollToSection(next);
        },
        [s3ClickTriggered, isTransitioningRef, getScrollTarget, scrollToSection],
    );

    // ── Event listener setup ───────────────────────────────────────────────
    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        const handleScroll = () => {
            const scrollLeft = el.scrollLeft;

            // Section 3 lock
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

            // Determine real section index based on scroll location
            let rawIndex = 0;
            if (scrollLeft <= 4.2 * window.innerWidth) {
                rawIndex = Math.round(scrollLeft / window.innerWidth);
            } else {
                rawIndex = targetSectionRef.current;
            }

            // Downgrade permission if user returns to section 7 from section 8
            if (
                rawIndex === 7 &&
                currentSectionRef.current === 8 &&
                hubAccessGrantedRef.current === "outreachvideo"
            ) {
                hubAccessGrantedRef.current = "outreach";
            }

            // Hub authorization gate
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

                // If we land back on the main timeline (indices 0-4), restore collapsed sections
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
