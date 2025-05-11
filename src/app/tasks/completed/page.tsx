import FilteredTaskPage from "@/components/task/FilteredTaskPage";

const CompletedTasksPage = () => {
	return (
		<FilteredTaskPage
			title="Завершенные задачи"
			filterType="completed"
		/>
	);
};

export default CompletedTasksPage;