import { SidebarItem } from "@/components/layout/sidebar-item";
import { SidebarDropdownItem } from "@/components/layout/sidebar-dropdown-item";
import {
    BellIcon,
    PlusIcon,
    PresentationChartLineIcon,
    RectangleStackIcon,
    UserGroupIcon,
} from "@heroicons/react/24/outline";
import { Avatar } from "@/components/layout/avatar";
import ProjectCreationModal from "@/components/forms/ProjectCreationModal";
import { useModalStore } from "@/store/useModalStore";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function Sidebar() {
    const {
        openTaskCreationModal,
        openProjectCreationModal,
        closeProjectCreationModal,
        isProjectCreationModalOpen,
    } = useModalStore();

    const { data: projects = [], isLoading } = useQuery({
        queryKey: ["projects"],
        queryFn: async () => {
            const response = await axios.get("/api/projects");
            return response.data;
        },
    });

    // 1. Сначала получаем basic user info (включая ID)
    const { data: basicUserInfo } = useQuery({
        queryKey: ["basicUserInfo"],
        queryFn: async () => {
            const response = await axios.get("/api/users/me");
            return response.data;
        },
    });

    // 2. Затем получаем полную информацию о пользователе, используя ID
    const { data: fullUserInfo } = useQuery({
        queryKey: ["fullUserInfo", basicUserInfo?.id],
        queryFn: async () => {
            if (!basicUserInfo?.id) return null;
            const response = await axios.get(`/api/users/${basicUserInfo.id}`);
            return response.data;
        },
        enabled: !!basicUserInfo?.id, // Запрос выполнится только когда есть ID
    });

    const menuItems = [
        { href: "/notifications", icon: <BellIcon />, text: "Уведомления" },
        { onClick: openTaskCreationModal, icon: <PlusIcon />, text: "Новая задача" },
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
                {
                    onClick: openProjectCreationModal,
                    text: "Добавить проект",
                    icon: <PlusIcon />,
                },
                ...(isLoading
                  ? [{ text: "Загрузка проектов..." }]
                  : projects.map((project: { id: string; name: string }) => ({
                      href: `/projects/${project.id}`,
                      text: project.name,
                  }))),
            ],
        },
        // {
        //     title: "Команды",
        //     icon: <UserGroupIcon />,
        //     items: [{ href: "/teams", text: "Все команды" }],
        // },
    ];

    // Формируем имя пользователя
    const getUserName = () => {
        if (!fullUserInfo) return "Загрузка...";
        return [fullUserInfo.name, fullUserInfo.surname].filter(Boolean).join(" ") || fullUserInfo.login;
    };

    return (
      <>
          <aside className="fixed h-screen w-80 pt-5 pb-5 border-r border-gray-200">
              <nav className="flex-1 space-y-0">
                  {menuItems.map((item, index) => (
                    <SidebarItem key={index} href={item.href} icon={item.icon} onClick={item.onClick}>
                        {item.text}
                    </SidebarItem>
                  ))}
                  {dropdownItems.map((item, index) => (
                    <SidebarDropdownItem
                      key={index}
                      title={item.title}
                      icon={item.icon}
                      items={item.items}
                    />
                  ))}
              </nav>
              <Avatar
                  username={getUserName()}
                  avatarUrl={fullUserInfo?.avatar_url || ""}
              />
          </aside>
          <ProjectCreationModal isOpen={isProjectCreationModalOpen} onClose={closeProjectCreationModal} />
      </>
    );
}
