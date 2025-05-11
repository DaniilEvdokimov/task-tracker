"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import {twMerge} from "tailwind-merge";

interface SidebarItemProps {
    href?: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    onClick?: () => void;
}

export function SidebarItem({ href, icon, children, onClick }: SidebarItemProps) {
    const pathname = usePathname();
    const isActive = href && pathname === href;

    const className = twMerge(
      "flex items-center py-3 px-4 text-gray-700 w-full hover:cursor-pointer",
      " hover:text-blue-600 rounded-lg transition-colors duration-200",
      isActive && "bg-blue-50 text-blue-600 font-medium"
    );

    if (onClick) {
        return (
          <button onClick={onClick} className={className}>
              <span className="w-6 h-6 mr-4">{icon}</span>
              {children}
          </button>
        );
    }

    return (
      <Link href={href || "#"} className={className}>
          <span className="w-6 h-6 mr-4">{icon}</span>
          {children}
      </Link>
    );
}

