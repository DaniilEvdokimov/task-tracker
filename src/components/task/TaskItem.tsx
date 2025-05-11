import { Task, TaskStatus } from "@/types";
import {DateTime} from "luxon";
import {Checkbox} from "@headlessui/react";
import {TaskType} from "@/components/task/TaskList";
import axios from "axios";

export const TaskItem = ({
	                         task,
	                         index,
	                         isLast,
	                         taskType,
	                         activeCheckboxId,
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
	const borderColor =
		taskType === "overdue" ? "border-l-yellow-500" :
			taskType === "current" ? "border-l-blue-500" :
				"border-l-green-500";

	const handleStatusUpdate = async () => {
		try {
			await axios.put(`/api/tasks/${task.id}/status`, { status: "Закрыта" as TaskStatus });

			onTaskStatusUpdate(task.id, "Закрыта");

			setActiveCheckboxId(task.id.toString());
		} catch (error) {
			console.error("Ошибка при обновлении статуса задачи:", error);
		}
	};

	return (
		<li
			key={task.id}
			className={`flex justify-between rounded-sm border-l-4 items-center bg-white p-2.5 ${borderColor} ${
				isLast ? '' : 'border-b border-gray-300'
			}`}
		>
			<div className="flex items-center gap-10 flex-grow">
				<div className="flex items-center gap-3">
					<Checkbox
						id={`task-${task.id}`}
						checked={task.status === "Закрыта"}
						onChange={handleStatusUpdate}
						className="
							w-4.5 h-4.5 border-1 border-blue-500
							rounded-xs hover:cursor-pointer hover:border-blue-600
							flex items-center justify-center
						"
					>
						<span
							className={`block w-[10px] h-[10px] rounded-xs bg-blue-600 ${
								task.status === "Закрыта" ? '' : 'hidden'
							}`}
						></span>
					</Checkbox>
					<label
						htmlFor={`task-${task.id}`}
						className="text-gray-500 text-xs hover:cursor-pointer hover:text-blue-500"
						onClick={handleStatusUpdate}
					>
						Завершить
					</label>
				</div>
				<p>{task.title}</p>
			</div>
			<div className="flex items-center justify-between min-w-[350px]">
				<span className="text-gray-500 text-xs">
					до {task.due_date ? DateTime.fromISO(task.due_date).toFormat('dd.MM.yyyy') : 'Нет дедлайна'}
				</span>
				<span
					className={`bg-yellow-200 rounded-full px-1.5 text-xs ${
						task.project ? '' : 'invisible'
					}`}
				>
					{task.project?.name || 'placeholder'}
				</span>
			</div>
		</li>
	);
};