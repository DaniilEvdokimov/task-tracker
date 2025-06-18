
import { Task, TaskStatus } from "@/types";
import {DateTime} from "luxon";
import {TaskType} from "@/components/task/TaskList";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import TaskEditForm from "@/components/forms/TaskEditForm";
import { getProjectColor } from "@/utils/projectColors";

export const TaskItem = ({
							 task,
							 isLast,
							 taskType,
							 setActiveCheckboxId,
							 onTaskStatusUpdate,
						 }: {
	task: Task;
	index: number;
	isLast: boolean;
	taskType: TaskType;
	activeCheckboxId: string | null;
	setActiveCheckboxId: (id: string | null) => void;
	onTaskStatusUpdate: (taskId: number, status: TaskStatus) => void;
}) => {
	const queryClient = useQueryClient();
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);

	const borderColor =
		taskType === "overdue" ? "border-l-yellow-500" :
			taskType === "current" ? "border-l-blue-500" :
				"border-l-green-500";

	const updateTaskStatusMutation = useMutation({
		mutationFn: async (newStatus: TaskStatus) => {
			const response = await axios.put(`/api/tasks/${task.id}/status`, {
				status: newStatus
			});
			return response.data;
		},
		onSuccess: (data, newStatus) => {
			// Инвалидируем кэш для всех запросов задач
			queryClient.invalidateQueries({ queryKey: ['getAllTasks'] });
			queryClient.invalidateQueries({ queryKey: ['getTasksByProject'] });
			// Вызываем колбэк для обновления локального состояния
			onTaskStatusUpdate(task.id, newStatus);
			setActiveCheckboxId(task.id.toString());
		},
		onError: (error) => {
			console.error("Ошибка при обновлении статуса задачи:", error);
		}
	});

	const handleStatusUpdate = (event: React.MouseEvent) => {
		event.stopPropagation(); // Предотвращаем открытие модального окна
		updateTaskStatusMutation.mutate("Закрыта");
	};

	const handleTaskClick = () => {
		setIsEditModalOpen(true);
	};

	const handleCloseEditModal = () => {
		setIsEditModalOpen(false);
	};

	const isCompleted = task.status === "Закрыта";

	return (
		<>
			<li
				key={task.id}
				className={`flex justify-between rounded-sm border-l-4 items-center bg-white p-2.5 ${borderColor} ${
					isLast ? '' : 'border-b border-gray-300'
				} hover:bg-gray-50 cursor-pointer`}
				onClick={handleTaskClick}
			>
				<div className="flex items-center gap-10 flex-grow">
					<div className="flex items-center gap-3">
						<label
							htmlFor={`task-${task.id}`}
							className={`text-gray-500 text-xs ${
								isCompleted
									? 'cursor-default'
									: updateTaskStatusMutation.isPending
										? 'opacity-50 cursor-not-allowed'
										: 'hover:cursor-pointer hover:text-blue-500'
							}`}
							onClick={
								isCompleted || updateTaskStatusMutation.isPending
									? undefined
									: handleStatusUpdate
							}
						>
							{isCompleted
								? 'Завершено'
								: updateTaskStatusMutation.isPending
									? 'Завершается...'
									: 'Завершить'
							}
						</label>
					</div>
					<p>{task.title}</p>
				</div>
				<div className="flex items-center justify-between min-w-[350px]">
					<span className="text-gray-500 text-xs">
						до {task.due_date ? DateTime.fromISO(task.due_date).toFormat('dd.MM.yyyy') : 'Нет дедлайна'}
					</span>
					<span
						className={`${getProjectColor(task.project)} rounded-full px-1.5 text-xs ${
							task.project ? '' : 'invisible'
						}`}
					>
						{task.project?.name || 'placeholder'}
					</span>
				</div>
			</li>

			{/* Модальное окно редактирования */}
			<TaskEditForm
				isOpen={isEditModalOpen}
				onClose={handleCloseEditModal}
				taskId={task.id}
			/>
		</>
	);
};
