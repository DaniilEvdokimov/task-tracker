"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

interface SidebarDropdownItemProps {
  title: string;
  icon: React.ReactNode;
  items: {
    href?: string;
    text: string;
    onClick?: () => void;
    icon?: React.ReactNode;
  }[];
}

export function SidebarDropdownItem({ title, icon, items }: SidebarDropdownItemProps) {
  const pathname = usePathname();
  const [isManuallyOpened, setIsManuallyOpened] = useState(false);

  const isAnyChildActive = items.some((item) => item.href === pathname);
  const shouldShowOpen = isManuallyOpened || isAnyChildActive;

  const handleHeaderClick = () => {
    setIsManuallyOpened(!isManuallyOpened);
  };

  return (
    <div className="flex flex-col">
      <div
        onClick={handleHeaderClick}
        className="flex items-center justify-between gap-2 pt-2 pb-2 pl-5 text-[#1F2937] hover:text-[#3B82F6] cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <span className="h-6 w-6">{icon}</span>
          {title}
        </div>
        <span className="h-5 w-5 mr-4">
          {shouldShowOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </span>
      </div>
      {shouldShowOpen && (
        <div className="ml-12 mt-1 mb-1">
          {items.map((item, index) => {
            if (item.href) {
              return (
                <Link
                  key={index}
                  href={item.href}
                  className={`block py-1 ${
                    pathname === item.href
                      ? "text-[#3B82F6] font-bold"
                      : "text-[#1F2937] hover:text-[#3B82F6]"
                  } flex items-center gap-2`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {item.icon && <span className="h-5 w-5">{item.icon}</span>}
                  {item.text}
                </Link>
              );
            }

            if (item.onClick) {
              return (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    item.onClick?.();
                  }}
                  className="w-full text-left py-1 text-sm text-[#1F2937]
                   hover:text-[#3B82F6] hover:cursor-pointer
                    flex items-center gap-2"
                >
                  {item.icon && <span className="h-5 w-5">{item.icon}</span>}
                  {item.text}
                </button>
              );
            }

            return (
              <span
                key={index}
                className="block py-1 text-sm text-[#9CA3AF] flex items-center gap-2"
              >
                {item.icon && <span className="h-5 w-5">{item.icon}</span>}
                {item.text}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}