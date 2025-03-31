import Link from 'next/link';

export function SidebarItem({
                                href,
                                icon,
                                children,
                            }: {
    href: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <Link
            href={href}
            className="flex items-center gap-2 font-inter font-normal text-base leading-6 tracking-normal pt-2 pb-2 pl-5"
        >
            {icon}
            {children}
        </Link>
    );
}
