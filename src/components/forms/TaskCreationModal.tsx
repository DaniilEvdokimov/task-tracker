"use client";
import React from "react";
import { Dialog} from "@headlessui/react";
import {useForm, Controller} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DateTime } from "luxon";
import axios from "axios";
import {TaskFormData, TaskFormSchema} from "@/schemas/tasks";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Input } from "@/components/Input";
import {useMutation, useQuery} from "@tanstack/react-query";
import {TextAreaField} from "@/components/TextAreaField";
import {SelectField} from "@/components/SelectField";
import {clsx} from "clsx";


type User = { id: number; name: string };
type Project = { id: number; name: string };

const PRIORITY_OPTIONS = [
	{ value: "Низкий", label: "Низкий" },
	{ value: "Нормальный", label: "Нормальный" },
	{ value: "Высокий", label: "Высокий" },
];

const DEFAULT_FORM_VALUES: TaskFormData = {
	title: "",
	description: "",
	due_date: DateTime.now().toFormat('yyyy-MM-dd'),
	priority: "Нормальный",
	status: "Новая",
	executor_id: 0,
	project_id: undefined,
};

export default function TaskCreationModal({
	isOpen,
	onClose,
}: {
	isOpen: boolean;
	onClose: () => void;
}) {
	const { data: users = [] } = useQuery<User[]>({
		queryKey: ["users"],
		queryFn: () => axios.get("/api/users").then((res) => res.data),
		enabled: isOpen,
	});

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
	} = useForm({
		resolver: zodResolver(TaskFormSchema),
		defaultValues: DEFAULT_FORM_VALUES
	});

	const createTaskMutation = useMutation({
		mutationFn: (data: TaskFormData) =>
			axios.post('/api/tasks', data).then(res => res.data),
		onSuccess: () => {
			onClose();
			reset(DEFAULT_FORM_VALUES);
		},
		onError: (error) => {
			console.error("Ошибка при создании задачи:", error);
		}
	});

	const clearDueDate = () => {
		setValue("due_date", DateTime.now().toFormat('yyyy-MM-dd'));
	};

	return (
		<Dialog open={isOpen} onClose={onClose} className="relative z-50">
			<div className="fixed inset-0 bg-black/30" aria-hidden="true" />
			<div className="fixed inset-0 flex items-center justify-center p-4">
				<Dialog.Panel className="w-full max-w-lg bg-white p-4 rounded shadow-lg relative">
					<button onClick={onClose} className="absolute top-2.5 right-2.5 p-1">
						<XMarkIcon className="w-8 h-8 stroke-gray-500 hover:stroke-black hover:cursor-pointer" />
					</button>
					<Dialog.Title className="text-lg font-bold">Новая задача</Dialog.Title>

					<form onSubmit={handleSubmit((data) => createTaskMutation.mutate(data))}
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
												} // Преобразуем Date в строку формата 'yyyy-MM-dd'
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
						</div>
						<button
							type="submit"
							disabled={createTaskMutation.status === "pending"}
							className="w-full mt-6 py-2.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
						>
							{createTaskMutation.status === "pending" ? "Создание..." : "Создать задачу"}
						</button>
					</form>
				</Dialog.Panel>
			</div>
		</Dialog>
	);
}