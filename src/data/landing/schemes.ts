export interface SchemeItem {
    id: string;
    src: string;
    title: string;
    caption: string;
    tooltip: string;
    desc: string;          // ← new: one-line card description
    isPrimary?: boolean;   // ← new: Green Krishi gets special treatment
    navigateTo: number;
}

export interface PlacedItem extends SchemeItem {
    top: number;
    left: number;
    baseWidth: number;
    rotate: number;
    floatDuration: number;
    floatDelay: number;
    floatX: number;
    floatY: number;
    floatRotate: number;
}

export const SCHEME_ITEMS: SchemeItem[] = [
    { id: "pm-kisan",     src: "https://picsum.photos/seed/krishi1/600/450",  title: "PM-KISAN",            caption: "Direct Benefit · ₹6,000/yr",       tooltip: "₹6,000/year direct income support to 110M+ farmers",        desc: "Direct income support to 110M+ farm households annually.",         navigateTo: 2 },
    { id: "kcc",          src: "https://picsum.photos/seed/krishi2/600/450",  title: "Kisan Credit Card",   caption: "Credit Access · Up to ₹3L",        tooltip: "Affordable short-term credit for seeds, fertilisers & tools", desc: "Affordable credit for seeds, tools and agricultural inputs.",       navigateTo: 2 },
    { id: "pmfby",        src: "https://picsum.photos/seed/krishi3/600/450",  title: "PMFBY",               caption: "Crop Insurance · Risk Cover",       tooltip: "Full crop-loss protection against weather & pest damage",     desc: "Full crop-loss protection against weather and pest damage.",        navigateTo: 2 },
    { id: "soil-health",  src: "https://picsum.photos/seed/krishi4/600/450",  title: "Soil Health Card",    caption: "Precision Farming · 22M+ Farmers", tooltip: "Nutrient-based advisory issued to 22M+ farm households",      desc: "Nutrient-based advisory for 22M+ farm households nationwide.",      navigateTo: 2 },
    { id: "enam",         src: "https://picsum.photos/seed/krishi5/600/450",  title: "e-NAM",               caption: "Market Access · 1,000+ Mandis",    tooltip: "Unified online trading platform linking 1,000+ mandis",      desc: "Unified digital market linking 1,000+ agricultural mandis.",        navigateTo: 2 },
    { id: "rkvy",         src: "https://picsum.photos/seed/krishi6/600/450",  title: "RKVY",                caption: "Infrastructure · State Dev",        tooltip: "State-level agri development & farmer income boost fund",     desc: "State-level agriculture infrastructure and income growth fund.",    navigateTo: 2 },
    { id: "paramparagat", src: "https://picsum.photos/seed/krishi7/600/450",  title: "Paramparagat Krishi", caption: "Organic Farming · Cluster Cert.",   tooltip: "Cluster-based organic certification & direct market linkage", desc: "Cluster-based organic farming certification and market access.",    navigateTo: 2, isPrimary: true },
    { id: "pm-sinchai",   src: "https://picsum.photos/seed/krishi8/600/450",  title: "PM Krishi Sinchai",   caption: "Irrigation · Har Khet Ko Pani",    tooltip: "Water security for every farm — drip, sprinkler & canals",   desc: "Water security for every field — drip, sprinkler and canals.",     navigateTo: 2 },
    { id: "agri-infra",   src: "https://picsum.photos/seed/krishi9/600/450",  title: "Agri Infra Fund",     caption: "Post-Harvest · ₹1L Cr Fund",       tooltip: "₹1 lakh crore fund for cold chains, storage & processing",   desc: "₹1 lakh crore fund for cold chains, storage and processing hubs.", navigateTo: 2 },
    { id: "pkvy",         src: "https://picsum.photos/seed/krishi10/600/450", title: "PKVY",                caption: "Organic Villages · Cluster",        tooltip: "Promotes organic farming clusters across Indian villages",    desc: "Promotes organic farming clusters across rural Indian villages.",   navigateTo: 2 },
    { id: "smam",         src: "https://picsum.photos/seed/krishi11/600/450", title: "SMAM",                caption: "Mechanisation · Custom Hiring",     tooltip: "Farm equipment access via custom hiring centres nationwide",  desc: "Farm equipment access via custom hiring centres nationwide.",       navigateTo: 2 },
    { id: "midh",         src: "https://picsum.photos/seed/krishi12/600/450", title: "MIDH",                caption: "Horticulture · Integrated Dev.",    tooltip: "Integrated horticulture development for fruits & vegetables", desc: "Integrated horticulture development for fruits and vegetables.",    navigateTo: 2 },
];

const CURATED_LAYOUT = [
    { top: 22, left: 12, baseWidth: 124, rotate: -1.3 },
    { top: 23, left: 30, baseWidth: 138, rotate: 0.8 },
    { top: 22, left: 70, baseWidth: 136, rotate: -0.7 },
    { top: 25, left: 88, baseWidth: 122, rotate: 1.1 },
    { top: 42, left: 9, baseWidth: 132, rotate: 0.9 },
    { top: 63, left: 17, baseWidth: 142, rotate: -0.8 },
    { top: 77, left: 25, baseWidth: 172, rotate: 0.4 },
    { top: 78, left: 73, baseWidth: 142, rotate: -0.6 },
    { top: 62, left: 84, baseWidth: 136, rotate: 0.7 },
    { top: 40, left: 91, baseWidth: 126, rotate: -1.0 },
    { top: 83, left: 10, baseWidth: 116, rotate: 1.2 },
    { top: 84, left: 90, baseWidth: 116, rotate: -1.2 },
];

export function scatterLayout(items: SchemeItem[]): PlacedItem[] {
    return items.map((item, i) => {
        const placement = CURATED_LAYOUT[i % CURATED_LAYOUT.length];
        const emphasis = item.isPrimary ? 1.16 : 1;
        const floatDirection = i % 2 === 0 ? 1 : -1;

        return {
            ...item,
            top: placement.top,
            left: placement.left,
            baseWidth: Math.round(placement.baseWidth * emphasis),
            rotate: placement.rotate,
            floatDuration: 14 + (i % 4) * 1.6,
            floatDelay: -(i % 5) * 1.4,
            floatX: floatDirection * (3 + (i % 3)),
            floatY: -floatDirection * (2 + (i % 2)),
            floatRotate: floatDirection * 0.45,
        };
    });
}
