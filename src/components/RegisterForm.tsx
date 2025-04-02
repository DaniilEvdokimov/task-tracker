'use client';

import {Button} from "@headlessui/react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useMutation} from "@tanstack/react-query";
import {useRouter} from "next/navigation";
import axios from "axios";
import {registerSchema, TregisterSchema} from "@/schemas/auth/registerSchema";
import { Input } from '@/components/Input';

export default function RegisterForm() {
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
		reset,
		watch
	} = useForm({resolver: zodResolver(registerSchema),mode: "onChange"});

	const mutation = useMutation({
		mutationFn: async(data: TregisterSchema) => {
			return axios.post('/api/auth/register', data, {
				headers: {
					'Content-Type': 'application/json',
				},
			});
		},
		onSuccess: () => {
			router.push("/login");
			reset();
		}
	});

	async function onSumbit(data: TregisterSchema) {
		mutation.mutate(data);
	}

	return (
		<form onSubmit={handleSubmit(onSumbit)} className='flex flex-col items-start justify-center
		    mt-10 px-6 py-10 w-1/4 bg-white gap-6 border border-gray-300
		    rounded-xl shadow-[0px_8px_16px_0px_#E5E7EB]'
		>
			<h2 className=''>Регистрация</h2>
			<div className='w-full flex flex-col gap-4'>
				<Input
					label='имя'
				  name='name'
					type='text'
					placeholder='Ярополк'
					error={errors.name}
					{...register('name')}
				/>
				<Input
					label='Фамилия'
					name='surname'
					type='text'
					placeholder='Иванов'
					error={errors.surname}
					{...register('surname')}
				/>
				<Input
					label='e-mail адрес'
					name='email'
					type='text'
					placeholder='ivanov@yandex.ru'
					error={errors.email}
					{...register('email')}
				/>
				<Input
					label='Имя аккаунта'
					name='login'
					type='text'
					placeholder='Yaropolik'
					error={errors.login}
					{...register('login')}
				/>
				<Input
					label='Придумайте пароль'
					name='password'
					type='password'
					placeholder='******'
					error={errors.password}
					{...register('password')}
				/>
				<Input
					label='Повторите пароль'
					name='confirmPassword'
					type='password'
					placeholder='******'
					error={errors.confirmPassword}
					{...register('confirmPassword')}
				/>
			</div>
			<Button disabled={!isValid} type='submit' className='text-white bg-blue-500 text-[14px] rounded-sm  py-2 w-full transition-colors
			  duration-75 ease-in-out  outline-none hover:bg-blue-600 cursor-pointer disabled:bg-gray-300'
			>
				{mutation.isPending ? 'Регистрация...' : 'Зарегистрироваться' }
			</Button>
		</form>
	)
}