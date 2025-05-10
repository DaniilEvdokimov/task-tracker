import {Controller} from "react-hook-form";
import React from "react";

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
		<label className="block text-sm font-medium text-gray-500">{label}</label>
		<Controller
			name={name}
			control={control}
			render={({ field }) => (
				<select
					className="mt-1 block w-full border rounded p-2.5 text-base"
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
		{error && <p className="text-red-500 text-sm">{error}</p>}
	</div>
);