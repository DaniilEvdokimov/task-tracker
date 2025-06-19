import { Notification } from "@/types";
import { NotificationItem } from "@/components/notifications/NotificationItem";

export type NotificationType = "all" | "unread" | "read";

export const NotificationList = ({
	data,
	notificationType,
	onNotificationRead,
}: {
	data: Notification[];
	notificationType: NotificationType;
	onNotificationRead: (notificationId: number) => void;
}) => (
	<ul>
		{data.map((notification, index) => (
			<NotificationItem
				key={notification.id}
				notification={notification}
				index={index}
				isLast={index === data.length - 1}
				onNotificationRead={onNotificationRead}
			/>
		))}
	</ul>
);