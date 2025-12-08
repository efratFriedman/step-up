"use client";

import { usePathname } from "next/navigation";
import Loader from "@/app/components/Loader/Loader";
import CategoryHabits from "@/app/components/Settings/CategoryHabits/CategoryHabits";

export default function SettingsPage() {
    const pathname = usePathname();
    const routeName = pathname.split("/").pop();

    if (!routeName) return <Loader />;

    return <CategoryHabits routeName={routeName} />;
}