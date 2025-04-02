"use client"; // Обязательно добавляем эту директиву

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";

export function LayoutContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLoginPage = pathname === "/login";

    return (
        <>
            {!isLoginPage && <Sidebar />}
            {children}
        </>
    );
}
