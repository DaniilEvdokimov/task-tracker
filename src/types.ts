export interface User {
	id: number;
	name: string;
	email: string;
}

export interface Project {
	id: number;
	name: string;
}

export interface Team {
	id: number;
	name: string;
}

export type TaskStatus = "Новая" | "В_работе" | "Готова" | "Закрыта" | "Отменена";

export interface Task {
	id: number;
	title: string;
	description?: string;
	due_date?: string; // DateTime в Prisma преобразуется в ISO-строку
	status: TaskStatus;
	priority: "Низкий" | "Средний" | "Высокий";
	creator_id: number;
	executor_id: number;
	project_id?: number;
	team_id?: number;
	parent_task_id?: number;

	created_at: string;
	updated_at: string;

	creator: User;
	executor: User;
	project?: Project;
	team?: Team;
}