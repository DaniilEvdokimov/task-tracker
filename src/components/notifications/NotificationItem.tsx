import { Notification } from "@/types";
import { DateTime } from "luxon";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { getProjectColor } from "@/utils/projectColors";

export const NotificationItem = ({
  notification,
  index,
  isLast,
  onNotificationRead,
}: {
  notification: Notification;
  index: number;
  isLast: boolean;
  onNotificationRead: (notificationId: number) => void;
}) => {
  const queryClient = useQueryClient();

  const markAsReadMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.put(`/api/notifications/${notification.id}/read`);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate notifications queries
      queryClient.invalidateQueries({ queryKey: ['getNotifications'] });
      // Call the callback to update local state
      onNotificationRead(notification.id);
    },
    onError: (error) => {
      console.error("Error marking notification as read:", error);
    }
  });

  const handleNotificationClick = () => {
    if (!notification.is_read) {
      markAsReadMutation.mutate();
    }
  };

  // Format the dates to a readable format
  const formattedDate = DateTime.fromISO(notification.created_at).toFormat('dd.MM.yyyy HH:mm');
  const formattedDueDate = notification.task?.due_date 
    ? DateTime.fromISO(notification.task.due_date).toFormat('dd.MM.yyyy')
    : 'Нет дедлайна';

  // Extract change type from notification message
  const getChangeType = (message: string) => {
    if (message.includes("Статус задачи изменен")) return "Изменен статус";
    if (message.includes("Приоритет задачи изменен")) return "Изменен приоритет";
    if (message.includes("Название задачи изменено")) return "Изменено название";
    if (message.includes("Проект задачи изменен")) return "Изменен проект";
    if (message.includes("Вам назначена задача")) return "Назначена задача";
    if (message.includes("переназначена")) return "Переназначена задача";
    if (message.includes("просрочена")) return "Задача просрочена";
    return "Уведомление";
  };

  const changeType = getChangeType(notification.message);

  return (
    <li
      key={notification.id}
      className={`flex justify-between rounded-sm border-l-4 items-center p-2.5 
        ${notification.is_read ? 'bg-gray-100 border-l-gray-300' : 'bg-white border-l-blue-500'} 
        ${isLast ? '' : 'border-b border-gray-300'} 
        hover:bg-gray-50 cursor-pointer`}
      onClick={handleNotificationClick}
    >
      <div className="flex items-center flex-grow">
        <span className="text-gray-500 text-xs min-w-[120px]">
          {formattedDate}
        </span>
        <div className="flex flex-col ml-4">
          <p className={notification.is_read ? 'text-gray-500' : 'font-medium'}>
            {changeType}
          </p>
          {notification.task && (
            <p className="text-gray-500 text-sm">
              {notification.task.title}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between min-w-[350px]">
        <span className="text-gray-500 text-xs">
          Срок выполнения: {formattedDueDate}
        </span>
        {notification.project && (
          <span 
            className={`${getProjectColor(notification.project)} rounded-full px-1.5 text-xs`}
          >
            {notification.project.name}
          </span>
        )}
      </div>
    </li>
  );
};
