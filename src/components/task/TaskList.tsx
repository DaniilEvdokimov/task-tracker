import { Task, TaskStatus } from "@/types";
import {TaskItem} from "@/components/task/TaskItem";

export type TaskType = "overdue" | "current" | "completed";

export const TaskList = ({
	                         data,
	                         taskType,
	                         activeCheckboxId,
	                         setActiveCheckboxId,
	                         onTaskStatusUpdate,
                         }: {
	data: Task[];
	taskType: TaskType;
	activeCheckboxId: string | null;
	setActiveCheckboxId: (id: string | null) => void;
	onTaskStatusUpdate: (taskId: number, status: TaskStatus) => void;
}) => (
	<ul>
		{data.map((task, index) => (
			<TaskItem
				key={task.id}
				task={task}
				index={index}
				isLast={index === data.length - 1}
				taskType={taskType}
				activeCheckboxId={activeCheckboxId}
				setActiveCheckboxId={setActiveCheckboxId}
				onTaskStatusUpdate={onTaskStatusUpdate}
			/>
		))}
	</ul>
);