import {ArrowLeftIcon, ArrowRightIcon} from "@heroicons/react/24/outline";

// - currentPage: состояние текущей страницы.
// - onPageChange: сеттер состояния/обработчик изменения текущей страницы.
const Pagination = ({
	                    currentPage,
	                    totalPages,
	                    onPageChange,
                    }: {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}) => {
	return (
		<div className="flex justify-start items-center gap-3 mt-auto pt-4">
			<button
				onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
				disabled={currentPage === 1}
				className={`${
					currentPage === 1
						? "text-gray-400 cursor-not-allowed"
						: "text-black hover:text-blue-500 hover:cursor-pointer"
				}`}
			>
				<ArrowLeftIcon className="h-6 w-6"/>
			</button>
			{[...Array(totalPages).keys()].map((page) => (
				<button
					key={page + 1}
					onClick={() => onPageChange(page + 1)}
					className={`px-4 py-2 text-sm ${
						currentPage === page + 1
							? "bg-blue-500 text-white rounded-sm"
							: "hover:bg-gray-200 text-gray-700 hover:cursor-pointer"
					}`}
				>
					{page + 1}
				</button>
			))}
			<button
				onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
				disabled={currentPage === totalPages}
				className={`${
					currentPage === totalPages
						? "text-gray-400 cursor-not-allowed"
						: "text-black hover:text-blue-500 hover:cursor-pointer"
				}`}
			>
				<ArrowRightIcon className="h-6 w-6"/>
			</button>
		</div>
	);
};

export default Pagination;