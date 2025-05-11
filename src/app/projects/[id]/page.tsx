"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import FilteredTaskPage from "@/components/task/FilteredTaskPage";
import { useModalStore } from "@/store/useModalStore";
import { use } from "react";

const ProjectPage = ({ params }: { params: Promise<{ id: string }> }) => {
	const { id: projectId } = use(params);
	const { data: project, isLoading, isError } = useQuery({
		queryKey: ["project", projectId],
		queryFn: () =>
			axios.get(`/api/projects/${projectId}`).then((res) => res.data),
	});

	const { openTaskCreationModal } = useModalStore();

	if (isLoading) {
		return <div>Загрузка...</div>;
	}

	if (isError || !project) {
		return <div>Ошибка загрузки проекта. Возможно, он не существует.</div>;
	}

	return (
		<div className="flex flex-col p-6">
			<div>
				<h1>
					Доска{" "}
					<span className="bg-[#FEF08A] p-2 text-xl rounded-full">
            {project.name}
          </span>
				</h1>
				<div className="mt-10">
					<button
						onClick={openTaskCreationModal}
						className="px-4 py-2 bg-blue-600 text-white rounded hover:cursor-pointer hover:bg-blue-700"
					>
						Добавить задачу
					</button>
				</div>
			</div>
			<FilteredTaskPage filterType="in-progress" projectId={projectId} />
		</div>
	);
};

export default ProjectPage;