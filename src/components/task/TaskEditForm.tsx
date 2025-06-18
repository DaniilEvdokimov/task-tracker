"use client";
import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DateTime } from "luxon";
import axios from "axios";
import { TaskFormData, TaskFormSchema } from "@/schemas/tasks";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Input } from "@/components/Input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TextAreaField } from "@/components/TextAreaField";
import { SelectField } from "@/components/SelectField";
import { clsx } from "clsx";
import { z } from "zod";

type User = { id: number; name: string };
type Project = { id: number; name: string };
type Comment = {
	id: number;
	content: string;
	created_at: string;
	user: {
		id: number;
		name: string;
		surname: string;
		email: string;
		avatar_url: string | null;
	};
};
type Task = TaskFormData & {
	id: number;
	created_at: string;
	updated_at: string;
	creator_id: number;
	parent_task_id?: number;
};

const PRIORITY_OPTIONS = [
	{ value: "Низкий", label: "Низкий" },
	{ value: "Нормальный", label: "Нормальный" },
	{ value: "Высокий", label: "Высокий" },
];

const STATUS_OPTIONS = [
	{ value: "Новая", label: "Новая" },
	{ value: "В_работе", label: "В работе" },
	{ value: "Готова", label: "Готова" },
	{ value: "Закрыта", label: "Закрыта" },
	{ value: "Отменена", label: "Отменена" },
];

const CommentSchema = z.object({
	content: z.string().min(1, "Комментарий не может быть пустым")
});

export default function TaskEditForm({
	                                     isOpen,
	                                     onClose,
	                                     taskId,
                                     }: {
	isOpen: boolean;
	onClose: () => void;
	taskId: number;
}) {
	const [newComment, setNewComment] = useState("");
	const queryClient = useQueryClient();

	// Fetch task data
	const { data: task, isLoading: isTaskLoading } = useQuery<Task>({
		queryKey: ["task", taskId],
		queryFn: () => axios.get(`/api/tasks/${taskId}`).then((res) => res.data),
		enabled: isOpen && !!taskId,
	});

	// Fetch comments
	const { data: comments = [], isLoading: isCommentsLoading } = useQuery<Comment[]>({
		queryKey: ["comments", taskId],
		queryFn: () => axios.get(`/api/tasks/${taskId}/comments`).then((res) => res.data),
		enabled: isOpen && !!taskId,
	});

	// Fetch users for executor selection
	const { data: users = [] } = useQuery<User[]>({
		queryKey: ["users"],
		queryFn: () => axios.get("/api/users").then((res) => res.data),
		enabled: isOpen,
	});

	// Fetch projects
	const { data: projects = [] } = useQuery<Project[]>({
		queryKey: ["projects"],
		queryFn: () => axios.get("/api/projects").then((res) => res.data),
		enabled: isOpen,
	});

	const {
		register,
		handleSubmit,
		control,
		reset,
		setValue,
		formState: { errors }
	} = useForm<TaskFormData>({
		resolver: zodResolver(TaskFormSchema),
		defaultValues: {
			title: "",
			description: "",
			due_date: DateTime.now().toFormat('yyyy-MM-dd'),
			priority: "Нормальный",
			status: "Новая",
			executor_id: 0,
			project_id: undefined,
		}
	});

	// Set form values when task data is loaded
	useEffect(() => {
		if (task) {
			reset({
				title: task.title,
				description: task.description || "",
				due_date: task.due_date instanceof Date
					? DateTime.fromJSDate(task.due_date).toFormat('yyyy-MM-dd')
					: task.due_date || DateTime.now().toFormat('yyyy-MM-dd'),
				priority: task.priority,
				status: task.status,
				executor_id: task.executor_id,
				project_id: task.project_id,
			});
		}
	}, [task, reset]);

	// Update task mutation
	const updateTaskMutation = useMutation({
		mutationFn: (data: TaskFormData) =>
			axios.put(`/api/tasks/${taskId}`, data).then(res => res.data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["task", taskId] });
			queryClient.invalidateQueries({ queryKey: ["tasks"] });
		},
		onError: (error) => {
			console.error("Ошибка при обновлении задачи:", error);
		}
	});


	// Add comment mutation
	const addCommentMutation = useMutation({
		mutationFn: (content: string) =>
			axios.post(`/api/tasks/${taskId}/comments`, { content }).then(res => res.data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["comments", taskId] });
			setNewComment("");
		},
		onError: (error) => {
			console.error("Ошибка при добавлении комментария:", error);
		}
	});

	const clearDueDate = () => {
		setValue("due_date", DateTime.now().toFormat('yyyy-MM-dd'));
	};

	const handleAddComment = () => {
		if (newComment.trim()) {
			addCommentMutation.mutate(newComment);
		}
	};


	if (isTaskLoading) {
		return <div>Загрузка...</div>;
	}

	return (
		<Dialog open={isOpen} onClose={onClose} className="relative z-50">
			<div className="fixed inset-0 bg-black/30" aria-hidden="true" />
			<div className="fixed inset-0 flex items-center justify-center p-4">
				<Dialog.Panel className="w-full max-w-lg bg-white p-4 rounded shadow-lg relative">
					<button onClick={onClose} className="absolute top-2.5 right-2.5 p-1">
						<XMarkIcon className="w-8 h-8 stroke-gray-500 hover:stroke-black hover:cursor-pointer" />
					</button>
					<Dialog.Title className="text-lg font-bold">Редактирование задачи</Dialog.Title>

					<form onSubmit={handleSubmit((data) => updateTaskMutation.mutate(data))}
					      className="mt-4 space-y-2">
						<Input
							label="Название задачи"
							{...register("title")}
							placeholder="Название задачи"
							error={errors.title?.message?.toString()}
						/>

						<div className="grid grid-cols-2 gap-6 text-sm">
							<TextAreaField
								label="Описание"
								register={register}
								name="description"
								placeholder="Введите описание задачи"
								error={errors.description?.message?.toString()}
							/>

							<SelectField
								label="Исполнитель"
								name="executor_id"
								control={control}
								options={users}
								error={errors.executor_id?.message?.toString()}
							/>

							<SelectField
								label="Проект"
								name="project_id"
								control={control}
								options={projects}
								error={errors.project_id?.message?.toString()}
							/>

							<div className="col-span-2 sm:col-span-1">
								<span className="text-gray-400">Срок исполнения</span>
								<div className="flex items-center">
									<Controller
										name="due_date"
										control={control}
										render={({ field }) => (
											<input
												{...field}
												type="date"
												className={clsx(
													"border border-gray-300 rounded-sm py-2 pl-2",
													"text-base mt-0.5 bg-white outline-none [&:placeholder-shown]:bg-gray-100",
													"[&:placeholder-shown]:text-gray-400",
													"focus:border-blue-500 hover:border-gray-400 hover:bg-white",
													{
														"border-red-500 focus:border-red-500": errors.due_date,
														"border-gray-300": !errors.due_date,
													},
													"w-full"
												)}
												min={DateTime.now().toISODate() || undefined}
												value={
													field.value instanceof Date
														? field.value.toISOString().split("T")[0]
														: field.value || ""
												}
												onChange={(e) => field.onChange(e.target.value)}
											/>
										)}
									/>
									<button
										type="button"
										onClick={clearDueDate}
										className="ml-2 text-gray-500 hover:text-gray-700"
									>
										<XMarkIcon className="w-6 h-6" />
									</button>
								</div>
								{errors.due_date && (
									<span className="text-red-500">{errors.due_date.message?.toString()}</span>
								)}
							</div>

							<div className="col-span-2 sm:col-span-1">
								<span className="text-gray-400">Приоритет</span>
								<Controller
									name="priority"
									control={control}
									render={({ field }) => (
										<select
											{...field}
											className={clsx(
												"border border-gray-300 rounded-sm py-2 pl-2",
												"text-base mt-0.5 bg-white outline-none [&:placeholder-shown]:bg-gray-100",
												"[&:placeholder-shown]:text-gray-400",
												"focus:border-blue-500 hover:border-gray-400 hover:bg-white",
												{
													"border-red-500 focus:border-red-500": errors.priority,
													"border-gray-300": !errors.priority,
												},
												"w-full"
											)}
										>
											{PRIORITY_OPTIONS.map((option) => (
												<option key={option.value} value={option.value}>
													{option.label}
												</option>
											))}
										</select>
									)}
								/>
								{errors.priority && (
									<span className="text-red-500">{errors.priority.message?.toString()}</span>
								)}
							</div>

							<div className="col-span-2 sm:col-span-1">
								<span className="text-gray-400">Статус</span>
								<Controller
									name="status"
									control={control}
									render={({ field }) => (
										<select
											{...field}
											className={clsx(
												"border border-gray-300 rounded-sm py-2 pl-2",
												"text-base mt-0.5 bg-white outline-none [&:placeholder-shown]:bg-gray-100",
												"[&:placeholder-shown]:text-gray-400",
												"focus:border-blue-500 hover:border-gray-400 hover:bg-white",
												{
													"border-red-500 focus:border-red-500": errors.status,
													"border-gray-300": !errors.status,
												},
												"w-full"
											)}
										>
											{STATUS_OPTIONS.map((option) => (
												<option key={option.value} value={option.value}>
													{option.label}
												</option>
											))}
										</select>
									)}
								/>
								{errors.status && (
									<span className="text-red-500">{errors.status.message?.toString()}</span>
								)}
							</div>
						</div>

						<button
							type="submit"
							disabled={updateTaskMutation.status === "pending"}
							className="w-full mt-6 py-2.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
						>
							{updateTaskMutation.status === "pending" ? "Сохранение..." : "Сохранить изменения"}
						</button>

						{/* Comments section */}
						<div className="mt-6">
							<h3 className="font-semibold mb-2">Комментарии</h3>

							<div className="border border-gray-200 rounded p-2 mb-4">
                <textarea
	                value={newComment}
	                onChange={(e) => setNewComment(e.target.value)}
	                placeholder="Добавить комментарий..."
	                className="w-full p-2 border border-gray-300 rounded resize-none"
	                rows={3}
                />
								<div className="flex justify-end mt-2">
									<button
										type="button"
										onClick={handleAddComment}
										disabled={!newComment.trim() || addCommentMutation.status === "pending"}
										className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
									>
										{addCommentMutation.status === "pending" ? "Отправка..." : "Отправить"}
									</button>
								</div>
							</div>

							{isCommentsLoading ? (
								<p>Загрузка комментариев...</p>
							) : comments.length === 0 ? (
								<p className="text-gray-500 text-sm">Нет комментариев</p>
							) : (
								<ul className="space-y-3">
									{comments.map((comment) => (
										<li key={comment.id} className="border-b border-gray-100 pb-2">
											<div className="flex items-start">
												<div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-2">
													{comment.user.avatar_url ? (
														<img
															src={comment.user.avatar_url}
															alt={`${comment.user.name} ${comment.user.surname}`}
															className="w-8 h-8 rounded-full"
														/>
													) : (
														<span className="text-xs">{comment.user.name.charAt(0)}{comment.user.surname?.charAt(0)}</span>
													)}
												</div>
												<div>
													<div className="flex items-baseline">
														<span className="font-medium text-sm">{comment.user.name} {comment.user.surname}</span>
														<span className="ml-2 text-xs text-gray-500">
                              {DateTime.fromISO(comment.created_at).toFormat('dd.MM.yyyy HH:mm')}
                            </span>
													</div>
													<p className="text-sm mt-1">{comment.content}</p>
												</div>
											</div>
										</li>
									))}
								</ul>
							)}
						</div>
					</form>
				</Dialog.Panel>
			</div>
		</Dialog>
	);
}
