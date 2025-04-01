"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface SidebarItemProps {
    href: string;
    icon: ReactNode;
    children: ReactNode;
}

export function SidebarItem({ href, icon, children }: SidebarItemProps) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            className={`flex items-center gap-2 font-inter text-base leading-6 tracking-normal pt-2 pb-2 pl-5 ${
                isActive
                    ? 'text-[#3B82F6] font-bold'
                    : 'text-[#1F2937] hover:text-[#3B82F6]'
            }`}
        >
            <span className="h-6 w-6">
                {icon}
            </span>
            {children}
        </Link>
    );
}
