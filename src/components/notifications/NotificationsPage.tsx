'use client';

import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { NotificationList, NotificationType } from "@/components/notifications/NotificationList";
import Pagination from "@/components/Pagination";

type FilterProps = {
	title?: string;
	filterType: "all" | "unread" | "read";
	projectId?: string;
};

const NotificationsPage = ({ title, filterType = "all", projectId }: FilterProps) => {
	const queryClient = useQueryClient();
	const [currentPage, setCurrentPage] = useState(1);
	const [activeFilter, setActiveFilter] = useState<"all" | "unread">(filterType === "read" ? "all" : filterType);
	const notificationsPerPage = 25;

	const fetchNotifications = () => {
		const params = new URLSearchParams();

		if (projectId) {
			params.append("project_id", projectId);
		}

		if (activeFilter === "unread") {
			params.append("is_read", "false");
		}

		let endpoint = `/api/notifications?${params.toString()}`;
		return axios.get(endpoint).then((res) => res.data);
	};

	const { data: notifications = [], isPending, isError, error } = useQuery({
		queryKey: ["getNotifications", activeFilter === "unread" ? "unread" : "all", projectId],
		queryFn: fetchNotifications,
	});

	const handleFilterChange = (filter: "all" | "unread") => {
		setActiveFilter(filter);
		setCurrentPage(1); // Reset to first page when changing filters
	};

	if (isPending) {
		return <div>Загрузка...</div>;
	}

	if (isError) {
		return <div>Ошибка: {error.message}</div>;
	}

	const onNotificationRead = (notificationId: number) => {
		queryClient.setQueryData(["getNotifications", filterType, projectId], (oldNotifications = []) =>
			oldNotifications.map((notification) => 
				notification.id === notificationId 
					? { ...notification, is_read: true } 
					: notification
			)
		);
	};

	const startIndex = (currentPage - 1) * notificationsPerPage;
	const paginatedNotifications = notifications.slice(startIndex, startIndex + notificationsPerPage);
	const totalPages = Math.ceil(notifications.length / notificationsPerPage);

	return (
		<div className="flex flex-col min-h-screen p-6">
			{title && <h1 className="mb-6">{title}</h1>}

			<div className="flex space-x-4 mb-6">
				<button
					className={`px-4 py-2 rounded-md ${
						activeFilter === "all"
							? "bg-blue-500 text-white"
							: "bg-gray-200 text-gray-700 hover:bg-gray-300"
					}`}
					onClick={() => handleFilterChange("all")}
				>
					Все
				</button>
				<button
					className={`px-4 py-2 rounded-md ${
						activeFilter === "unread"
							? "bg-blue-500 text-white"
							: "bg-gray-200 text-gray-700 hover:bg-gray-300"
					}`}
					onClick={() => handleFilterChange("unread")}
				>
					Непрочитанные
				</button>
			</div>

			{notifications.length === 0 ? (
				<p className="text-gray-500 text-lg">
					Нет уведомлений
				</p>
			) : (
				<>
					<div className="mb-6">
						<h2 className="mb-3 text-xl font-semibold">
							{activeFilter === "unread" ? "Непрочитанные уведомления" : "Все уведомления"}
						</h2>
						<NotificationList
							data={paginatedNotifications}
							notificationType={activeFilter as NotificationType}
							onNotificationRead={onNotificationRead}
						/>
					</div>
					<Pagination
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={setCurrentPage}
					/>
				</>
			)}
		</div>
	);
};

export default NotificationsPage;
