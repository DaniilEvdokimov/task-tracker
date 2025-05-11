"use client";

import React from "react";
import { Dialog } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const ProjectFormSchema = z.object({
	name: z.string().min(3, "Название проекта должно быть не менее 3 символов"),
});

type ProjectFormData = z.infer<typeof ProjectFormSchema>;

export default function ProjectCreationModal({
	isOpen,
	onClose,
}: {
	isOpen: boolean;
	onClose: () => void;
}) {
	const queryClient = useQueryClient();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(ProjectFormSchema),
		defaultValues: { name: "" },
	});

	const createProjectMutation = useMutation({
		mutationFn: (data: ProjectFormData) =>
			axios.post("/api/projects", data).then((res) => res.data),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["projects"] });
			onClose();
			reset();
		},
	});

	return (
		<Dialog open={isOpen} onClose={onClose} className="relative z-50">
			<div className="fixed inset-0 bg-black/30" aria-hidden="true" />
			<div className="fixed inset-0 flex items-center justify-center p-4">
				<Dialog.Panel className="w-full max-w-md bg-white p-6 rounded shadow-lg relative">
					<button onClick={onClose} className="absolute top-2.5 right-2.5 p-1">
						<XMarkIcon className="w-6 h-6 text-gray-500 hover:cursor-pointer hover:text-black" />
					</button>
					<Dialog.Title className="text-lg font-bold">Добавить проект</Dialog.Title>
					<form
						onSubmit={handleSubmit((data) => createProjectMutation.mutate(data))}
						className="mt-4 space-y-4"
					>
						<div>
							<label htmlFor="name" className="block text-sm text-gray-600">
								Название проекта
							</label>
							<input
								id="name"
								type="text"
								{...register("name")}
								className="w-full mt-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
							/>
							{errors.name && (
								<span className="text-red-500 text-sm">{errors.name.message}</span>
							)}
						</div>
							<button
								type="submit"
								className="w-full px-4 py-2 text-white hover:cursor-pointer bg-blue-500 rounded hover:bg-blue-600"
							>
								Создать проект
							</button>
					</form>
				</Dialog.Panel>
			</div>
		</Dialog>
	);
}