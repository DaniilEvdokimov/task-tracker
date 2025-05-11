'use client';

import {useQuery, useQueryClient} from "@tanstack/react-query";
import axios from "axios";
import {useState} from "react";
import {DateTime} from "luxon";
import {TaskList} from "@/components/task/TaskList";
import Pagination from "@/components/Pagination";
import {Task, TaskStatus} from "@/types";

type FilterProps = {
	title: string;
	filterType: "all" | "in-progress" | "completed";
};

const FilteredTaskPage = ({ title, filterType }: FilterProps) => {
	const queryClient = useQueryClient();
	const [activeCheckboxId, setActiveCheckboxId] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const tasksPerPage = 25;

	const { data: tasks = [], isPending, isError, error } = useQuery<Task[]>({
		queryKey: ["getAllTasks"],
		queryFn: () => axios.get("/api/tasks").then((res) => res.data),
	});

	if (isPending) {
		return <div>Загрузка...</div>;
	}

	if (isError) {
		return <div>Ошибка: {error.message}</div>;
	}

	const onTaskStatusUpdate = (taskId: number, status: TaskStatus) => {
		queryClient.setQueryData<Task[]>(["getAllTasks"], (oldTasks = []) =>
			oldTasks.map((task) =>
				task.id === taskId ? { ...task, status } : task
			)
		);
	};

	const groupTasks = (tasks: Task[]) => {
		const now = DateTime.now();
		const overdue = tasks.filter(
			(task) =>
				task.due_date &&
				DateTime.fromISO(task.due_date) < now &&
				task.status !== "Закрыта"
		);
		const current = tasks.filter(
			(task) =>
				task.due_date &&
				DateTime.fromISO(task.due_date) >= now &&
				task.status !== "Закрыта"
		);
		const completed = tasks.filter((task) => task.status === "Закрыта");

		return { overdue, current, completed };
	};

	const filteredTasks = (() => {
		const { overdue, current, completed } = groupTasks(tasks);

		switch (filterType) {
			case "completed":
				return [...completed];
			case "in-progress":
				return [...overdue, ...current];
			default:
				return [...overdue, ...current, ...completed];
		}
	})();

	const startIndex = (currentPage - 1) * tasksPerPage;
	const paginatedTasks = filteredTasks.slice(startIndex, startIndex + tasksPerPage);
	const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);
	const { overdue: paginatedOverdue, current: paginatedCurrent, completed: paginatedCompleted } =
		groupTasks(paginatedTasks);

	return (
		<div className="flex flex-col min-h-screen p-6">
			<h1 className="mb-6">{title}</h1>
			{paginatedOverdue.length > 0 && (
				<div className="mb-6">
					<h2 className="mb-3 text-xl font-semibold text-yellow-500">
						Просроченные
					</h2>
					<TaskList
						data={paginatedOverdue}
						taskType="overdue"
						activeCheckboxId={activeCheckboxId}
						setActiveCheckboxId={setActiveCheckboxId}
						onTaskStatusUpdate={onTaskStatusUpdate}
					/>
				</div>
			)}
			{paginatedCurrent.length > 0 && (
				<div className="mb-6">
					<h2 className="mb-3 text-xl font-semibold text-blue-500">
						Текущие
					</h2>
					<TaskList
						data={paginatedCurrent}
						taskType="current"
						activeCheckboxId={activeCheckboxId}
						setActiveCheckboxId={setActiveCheckboxId}
						onTaskStatusUpdate={onTaskStatusUpdate}
					/>
				</div>
			)}
			{paginatedCompleted.length > 0 && (
				<div className="mb-6">
					<h2 className="mb-3 text-xl font-semibold text-green-500">
						Завершенные
					</h2>
					<TaskList
						data={paginatedCompleted}
						taskType="completed"
						activeCheckboxId={activeCheckboxId}
						setActiveCheckboxId={setActiveCheckboxId}
						onTaskStatusUpdate={onTaskStatusUpdate}
					/>
				</div>
			)}
			<Pagination
				currentPage={currentPage}
				totalPages={totalPages}
				onPageChange={setCurrentPage}
			/>
		</div>
	);
};

export default FilteredTaskPage;