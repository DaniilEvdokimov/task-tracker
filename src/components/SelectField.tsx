import {Controller} from "react-hook-form";
import React from "react";
import {clsx} from "clsx";

export const SelectField = ({
	                            label,
	                            name,
	                            control,
	                            options,
	                            error,
                            }: {
	label: string;
	name: "executor_id" | "project_id";
	control: any;
	options: { id: number; name: string }[];
	error?: string;
}) => (
	<div className="col-span-2 sm:col-span-1">
		<span className="text-gray-400">{label}</span>
		<Controller
			name={name}
			control={control}
			render={({ field }) => (
				<select
					className={clsx(
						"border border-gray-300 rounded-sm p-2.5",
						"text-base mt-0.5 bg-white outline-none [&:placeholder-shown]:bg-gray-100",
						"[&:placeholder-shown]:text-gray-400",
						"focus:border-blue-500 hover:border-gray-400 hover:bg-white",
						{
							"border-red-500 focus:border-red-500": error,
							"border-gray-300": !error,
						},
						"w-full"
					)}
					onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
					value={field.value !== null ? field.value : ""}
				>
					<option value="">Выберите {label === 'Исполнитель' ? 'исполнителя': label.toLowerCase()}</option>
					{options.map((option) => (
						<option key={option.id} value={option.id}>
							{option.name}
						</option>
					))}
				</select>
			)}
		/>
		{error && <span className="text-red-500">{error}</span>}
	</div>
);