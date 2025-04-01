import { SidebarItem } from "@/components/layout/sidebar-item";
import { SidebarDropdownItem } from "@/components/layout/sidebar-dropdown-item";
import { BellIcon, PlusIcon, PresentationChartLineIcon, RectangleStackIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { Avatar } from "@/components/layout/avatar";

export function Sidebar() {
    const menuItems = [
        { href: "/notifications", icon: <BellIcon />, text: "Уведомления" },
        { href: "/tasks/new", icon: <PlusIcon/>, text: "Новая задача" },
    ];

    const dropdownItems = [
        {
            title: "Задачи",
            icon: <PresentationChartLineIcon />,
            items: [
                { href: "/tasks", text: "Все" },
                { href: "/tasks/in-progress", text: "В работе" },
                { href: "/tasks/completed", text: "Завершенные" },
            ],
        },
        {
            title: "Проекты",
            icon: <RectangleStackIcon />,
            items: [
                { href: "/projects", text: "Все проекты" },
            ],
        },
        {
            title: "Команды",
            icon: <UserGroupIcon />,
            items: [
                { href: "/teams", text: "Все команды" },
            ],
        },
    ];

    const allItems = [...menuItems, ...dropdownItems];

    return (
        <aside className="fixed h-screen w-80 pt-5 pb-5 border-r border-gray-200">
            <nav className="flex-1 space-y-0">
                {allItems.map((item, index) => (
                    <div key={`item-${index}`}>
                        {'items' in item ? (
                            <SidebarDropdownItem
                                title={item.title}
                                icon={item.icon}
                                items={item.items}
                            />
                        ) : (
                            <SidebarItem href={item.href} icon={item.icon}>
                                {item.text}
                            </SidebarItem>
                        )}
                        {index !== allItems.length - 1 && (
                            <div className="border-t border-gray-300 mx-4"></div>
                        )}
                    </div>
                ))}
            </nav>
            <Avatar
                username="Буба"
                avatarUrl=""
            />
        </aside>
    );
}
