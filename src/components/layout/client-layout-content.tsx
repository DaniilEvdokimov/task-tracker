"use client"; // Обязательно добавляем эту директиву

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import TaskCreationModal from "@/components/TaskCreationModal";
import {useModalStore} from "@/store/useModalStore";

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login" || pathname === "/register";
  const { isTaskCreationModalOpen, closeTaskCreationModal } = useModalStore();

  return (
    <>
      {!isLoginPage && <Sidebar />}
      <main className="ml-80">
        {children}
      </main>
      <TaskCreationModal
        isOpen={isTaskCreationModalOpen}
        onClose={closeTaskCreationModal}
      />
    </>
  );
}

