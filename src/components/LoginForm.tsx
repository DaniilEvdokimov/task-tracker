'use client';

import {Button, Input} from "@headlessui/react";
import Link from "next/link";
import clsx from 'clsx';
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {loginSchema, TloginSchema} from "@/schemas/auth/loginSchema";
import axios, {AxiosError} from "axios";
import {useMutation} from "@tanstack/react-query";
import {Dispatcher} from "undici-types";
import ResponseData = Dispatcher.ResponseData;
import { FormEvent } from 'react'
import { signIn } from "next-auth/react"



export default function LoginForm() {
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({
		resolver: zodResolver(loginSchema),

	});

	const {isPending, isError, isSuccess, error, mutate} = useMutation<ResponseData, AxiosError<{ error: string }>>({
		// mutationFn: (data: TloginSchema) => {
		// 	return axios.post('/api/auth/login', data);
		// }
	});

	function onSumbit(data: TloginSchema ) {
		signIn('credentials', data);
		reset();
	}

	if (isSuccess) {

	}

	return (
		<form onSubmit={handleSubmit(onSumbit)} className='flex flex-col items-start justify-center
		    mt-10 px-6 py-10 w-1/4 bg-white gap-6 border border-gray-300
		    rounded-xl shadow-[0px_8px_16px_0px_#E5E7EB]'
		>
			<h2 className=''>Вход в аккаунт</h2>
			<div className='w-full flex flex-col gap-4'>
				<label className='flex flex-col w-full text-xs'>
					e-mail или логин
					<Input {...register('loginOrEmail')} type='text' name='loginOrEmail' placeholder='ivanov@yandex.ru'
					       className={clsx('border border-gray-300 rounded-sm py-2 pl-2',
						       'text-base mt-0.5 bg-white outline-none [&:placeholder-shown]:bg-gray-100 ',
						       '[&:placeholder-shown]:text-gray-400',
						       'focus:border-blue-500 hover:border-gray-400 hover:bg-white',
						       {
							       'border-red-500 focus:border-red-500': errors.loginOrEmail,
							       'border-gray-300': !errors.loginOrEmail
						       }
					       )}
					/>
				</label>
				<label className='flex flex-col w-full text-xs'>
					пароль
					<Input {...register('password')}  type='password' name='password' placeholder='******' className=
						{clsx(
							'border border-gray-300 rounded-sm',
							'py-2 pl-2 text-base mt-0.5 outline-none bg-white [&:placeholder-shown]:text-gray-400',
							' [&:placeholder-shown]:bg-gray-100',
							'focus:border-blue-500 hover:border-gray-400 hover:bg-white',
							{
								'border-red-500 focus:border-red-500': errors.password,
								'border-gray-300': !errors.password
							}
						)}
					/>
					{isError? <span className='text-red-500'>{error.response?.data?.error || 'ошибка'}</span> : null}
					<Link href='/forgot-password' className='self-end text-base mt-1  text-gray-500 hover:text-blue-500'>
						забыли пароль?
					</Link>
				</label>
			</div>
			<Button type='submit' className='text-white bg-blue-500 text-[14px] rounded-sm  py-2 w-full transition-colors
			  duration-75 ease-in-out  outline-none hover:bg-blue-600 cursor-pointer'
			>
				{isPending ? 'Вход...' : 'Войти' }
			</Button>
		</form>
	)
}