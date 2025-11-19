import {
    Home,
    Lightbulb,
    BarChart3,
    Newspaper,
    Settings,
    User
} from "lucide-react";

import { ROUTES } from "./routes";

export const NAV_LINKS = [
    { href: ROUTES.HOME, icon: Home, label: "Home" },
    { href: ROUTES.INSIGHT, icon: Lightbulb, label: "Insight" },
    { href: ROUTES.STATS, icon: BarChart3, label: "Stats" },
    { href: ROUTES.POSTS, icon: Newspaper, label: "Posts" },
    { href: ROUTES.SETTINGS, icon: Settings, label: "Settings" },
    { href: ROUTES.PROFILE, icon: User, label: "Profile" },
];