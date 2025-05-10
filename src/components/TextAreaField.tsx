import {Textarea} from "@headlessui/react";
import {clsx} from "clsx";
import React from "react";

export const TextAreaField = ({
	label,
	register,
	name,
	placeholder,
	error,
}: {
	label: string;
	register: any;
	name: string;
	placeholder: string;
	error?: string;
}) => (
	<div className="col-span-2">
		<span className="text-gray-400">{label}</span>
		<Textarea
			{...register(name)}
			placeholder={placeholder}
			className={clsx(
				"border border-gray-300 rounded-sm py-2 pl-2",
				"text-base mt-0.5 bg-white outline-none [&:placeholder-shown]:bg-gray-100",
				"[&:placeholder-shown]:text-gray-400",
				"focus:border-blue-500 hover:border-gray-400 hover:bg-white",
				"resize-none",
				{
					"border-red-500 focus:border-red-500": error,
					"border-gray-300": !error,
				},
				"w-full"
			)}
		/>
		{error && <span className="text-red-500">{error}</span>}
	</div>
);