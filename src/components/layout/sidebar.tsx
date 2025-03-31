import {SidebarItem} from "@/components/layout/sidebarItem";
import { BellIcon, PlusIcon, PresentationChartLineIcon, RectangleStackIcon, UserGroupIcon } from '@heroicons/react/24/outline'

export function Sidebar() {
    const menuItems = [
        { href: "/notifications", icon: <BellIcon className="h-6 w-6"/>, text: "Уведомления" },
        { href: "/tasks", icon: <PlusIcon className="h-6 w-6"/>, text: "Новая задача" },
        { href: "/tasks", icon: <PresentationChartLineIcon className="h-6 w-6"/>, text: "Задачи" },
        { href: "/projects", icon: <RectangleStackIcon className="h-6 w-6"/>, text: "Проекты" },
        { href: "/teams", icon: <UserGroupIcon className="h-6 w-6"/>, text: "Команды" }
    ];

    return (
        <aside className="fixed h-screen w-80 pt-5 pb-5 border-r border-gray-200">
            <nav className="flex-1 space-y-0">
                {menuItems.map((item, index) => (
                    <div key={index}>
                        <SidebarItem href={item.href} icon={item.icon}>
                            {item.text}
                        </SidebarItem>
                        {index !== menuItems.length - 1 && (
                            <div className="border-t border-gray-200 mx-4"></div>
                        )}
                    </div>
                ))}
            </nav>
            <div></div>
        </aside>
    );
}
