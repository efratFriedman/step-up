export const ROUTES = {
    HOME: "/home",
    INSIGHT: "/insight",
    STATS: "/stats",
    POSTS: "/posts",
    SETTINGS: "/settings",
    PROFILE: "/profile",
    LOGIN: "/login",
    SIGNUP: "/signup"
} as const;

export const PUBLIC_ROUTES:string[] = [
    ROUTES.LOGIN,
    ROUTES.SIGNUP,
];

export const PROTECTED_ROUTES:string[] = [
    ROUTES.HOME,
    ROUTES.INSIGHT,
    ROUTES.STATS,
    ROUTES.POSTS,
    ROUTES.SETTINGS,
    ROUTES.PROFILE,
];