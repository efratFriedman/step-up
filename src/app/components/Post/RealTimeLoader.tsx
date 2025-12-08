"use client"

import { usePostStore } from "@/app/store/usePostStore";
import { useUserStore } from "@/app/store/useUserStore";
import { getPusherClient } from "@/lib/pusher-frontend";
import { useEffect } from "react";

export default function RealTimeLoader() {
    const user = useUserStore((s) => s.user);
    const initializePusherChannel = usePostStore((s) => s.initializePusherChannel);
    useEffect(() => {
        if (!user?.id) return;
        const pusher = getPusherClient(user.id);
        const unsubscribe = initializePusherChannel(user.id, pusher);

        return () => unsubscribe();
    }, [user?.id]);
}
