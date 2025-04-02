'use client';

import { Button } from '@headlessui/react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, TloginSchema } from '@/schemas/auth/loginSchema';
import { useMutation } from '@tanstack/react-query';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/Input';

export default function LoginForm() {
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
		reset,
	} = useForm({ resolver: zodResolver(loginSchema), mode: 'all' });

	const mutation = useMutation({
		mutationFn: async (data: TloginSchema) => {
			const result = await signIn('credentials', {
				...data,
				redirect: false,
			});

			if (result?.error) {
				throw new Error(result.error);
			}

			return result;
		},
		onSuccess: () => {
			router.push('/');
			reset();
		},
	});

	async function onSumbit(data: TloginSchema) {
		mutation.mutate(data);
		console.log(errors);
		console.log(mutation.error);
	}

	return (
		<form
			onSubmit={handleSubmit(onSumbit)}
			className="flex flex-col items-start justify-center mt-10 px-6 py-10 w-1/4 bg-white gap-6 border border-gray-300 rounded-xl shadow-[0px_8px_16px_0px_#E5E7EB]"
		>
			<h2 className="">Вход в аккаунт</h2>
			<div className="w-full flex flex-col gap-4">
				<Input
					label="e-mail или логин"
					type="text"
					placeholder="ivanov@yandex.ru"
					error={errors.loginOrEmail}
					{...register('loginOrEmail')}
				/>
				<Input
					label="пароль"
					type="password"
					placeholder="******"
					error={errors.password || (mutation.error?.message === 'CredentialsSignin' && 'Неправильный e-mail/логин или пароль')}
					{...register('password')}
				/>
				<Link
					href="/forgot-password"
					className="self-end text-base mt-1 text-gray-500 hover:text-blue-500"
				>
					забыли пароль?
				</Link>
			</div>
			<Button
				type="submit"
				disabled={!isValid}
				className="text-white bg-blue-500 text-[14px] rounded-sm py-2 w-full transition-colors duration-75 ease-in-out outline-none hover:bg-blue-600 cursor-pointer disabled:bg-gray-300"
			>
				{mutation.isPending ? 'Вход...' : 'Войти'}
			</Button>
		</form>
	);
}