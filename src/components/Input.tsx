'use client';

import { Input as HeadlessInput } from '@headlessui/react';
import { clsx } from 'clsx';
import { ComponentPropsWithoutRef, forwardRef } from 'react';
import { FieldError } from 'react-hook-form';

type InputProps = ComponentPropsWithoutRef<typeof HeadlessInput> & {
	label?: string;
	name?: string;
	error?: FieldError | string;
	register?: any;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
	({ label, error, register, className, name, ...props }, ref) => {
		return (
			<label className="flex flex-col w-full text-xs">
				{label}
				<HeadlessInput
					{...(register && name ? register(name) : {})}
					ref={ref}
					name={name}
					className={clsx(
						'border border-gray-300 rounded-sm py-2 pl-2',
						'text-base mt-0.5 bg-white outline-none [&:placeholder-shown]:bg-gray-100',
						'[&:placeholder-shown]:text-gray-400',
						'focus:border-blue-500 hover:border-gray-400 hover:bg-white',
						{
							'border-red-500 focus:border-red-500': error,
							'border-gray-300': !error,
						},
						className
					)}
					{...props}
				/>
				{error && (
					<span className="text-red-500">
            {typeof error === 'string' ? error : error.message}
          </span>
				)}
			</label>
		);
	}
);

Input.displayName = 'Input';