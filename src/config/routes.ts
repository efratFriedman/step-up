export const ROUTES = {
    LANDING: "/",
    HOME: "/home",
    INSIGHT: "/insight",
    STATS: "/stats",
    POSTS: "/posts",
    SETTINGS: "/settings",
    PROFILE: "/profile",
    LOGIN: "/login",
    SIGNUP: "/signup",
    FORGOT_PASSWORD: "/forgot-password",
} as const;

export const PUBLIC_ROUTES: string[] = [
    ROUTES.LOGIN,
    ROUTES.SIGNUP,
    ROUTES.FORGOT_PASSWORD,
    ROUTES.LANDING,
];

export const PROTECTED_ROUTES: string[] = [
    ROUTES.HOME,
    ROUTES.INSIGHT,
    ROUTES.STATS,
    ROUTES.POSTS,
    ROUTES.SETTINGS,
    ROUTES.PROFILE,
];

export const BLOCK_WHEN_LOGGED_IN: string[] = [
    ROUTES.LOGIN,
    ROUTES.SIGNUP,
    ROUTES.FORGOT_PASSWORD,
    ROUTES.LANDING,
];