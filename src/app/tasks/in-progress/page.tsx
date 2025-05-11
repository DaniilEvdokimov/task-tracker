import FilteredTaskPage from "@/components/task/FilteredTaskPage";

const InProgressTasksPage = () => {
	return (
		<FilteredTaskPage
			title="Задачи в работе"
			filterType="in-progress"
		/>
	);
};

export default InProgressTasksPage;