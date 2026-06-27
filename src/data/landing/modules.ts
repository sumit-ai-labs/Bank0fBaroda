export interface ModuleItem {
    id: string;
    order: number;
    title: string;
    subtitle?: string;
    description?: string;
    icon?: string;
    accentColor: string;
    route?: string;
    available: boolean;
    animationDelay?: string;
}

export const modulesData: ModuleItem[] = [
    {
        id: "module-research",
        order: 1,
        title: "Behaviour Research",
        subtitle: "Field studies & insights",
        accentColor: "#1B67C9",
        available: true,
        animationDelay: "0ms"
    },
    {
        id: "module-analytics",
        order: 2,
        title: "Citizen Analytics",
        subtitle: "Demographic intelligence",
        accentColor: "#eb6525",
        available: true,
        animationDelay: "150ms"
    },
    {
        id: "module-engine",
        order: 3,
        title: "Campaign Engine",
        subtitle: "Outreach automation",
        accentColor: "#111111",
        available: true,
        animationDelay: "300ms"
    },
    {
        id: "module-dashboard",
        order: 4,
        title: "Impact Dashboard",
        subtitle: "Measurable metrics",
        accentColor: "#2E9E5B",
        available: true,
        animationDelay: "450ms"
    },
    {
        id: "module-insights",
        order: 5,
        title: "AI Insights",
        subtitle: "Predictive science models",
        accentColor: "#777777",
        available: true,
        animationDelay: "600ms"
    },
    {
        id: "module-library",
        order: 6,
        title: "Behaviour Library",
        subtitle: "Validated interventions",
        accentColor: "#555555",
        available: true,
        animationDelay: "750ms"
    }
];
