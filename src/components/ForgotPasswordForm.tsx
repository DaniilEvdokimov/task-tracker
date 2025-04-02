'use client';

import {Button} from "@headlessui/react";
import Link from "next/link";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useMutation} from "@tanstack/react-query";
import axios from "axios";
import {Input} from '@/components/Input';
import {forgotPasswordSchema, TforgotPasswordSchema} from "@/schemas/auth/forgotPasswordSchema";

export default function ForgotPasswordForm() {
	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm({resolver: zodResolver(forgotPasswordSchema),mode: "onChange"});

	const mutation = useMutation({
		mutationFn: async(data: TforgotPasswordSchema) => {
			return await axios.post('/api/auth/forgot-password', data, {
				headers: {
					'Content-Type': 'application/json',
				}
			});
		}
	});


	async function onSumbit(data: TforgotPasswordSchema) {
		mutation.mutate(data);
		mutation.reset()
	}

	return (
		<form onSubmit={handleSubmit(onSumbit)} className='flex flex-col items-start justify-center
		    mt-10 px-6 py-10 w-1/4 bg-white gap-6 border border-gray-300
		    rounded-xl shadow-[0px_8px_16px_0px_#E5E7EB]'
		> {mutation.isSuccess ?
			<Link href='/login' className='mt-1 hover:text-blue-500'>
				Пароль успешно изменён,
				нажмите, чтобы перейти
				на страницу входа
			</Link> :
			 <>
				 <h2 className=''>Восстановление пароля</h2>
				 <div className='w-full flex flex-col gap-4'>
					 <Input
						 label='Введите e-mail адрес'
						 name='email'
						 type='text'
						 placeholder='ivanov@yandex.ru'
						 error={errors.email}
						 {...register('email')}
					 />
					 <Input
						 label='Придумайте новый пароль'
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
					 {/*@ts-ignore*/}
					 {mutation.isError && <span className='text-red-500 text-sm'>{mutation.error.response?.data.error}</span>}
				 </div>
				 <Button disabled={!isValid} type='submit' className='text-white bg-blue-500 text-[14px] rounded-sm  py-2 w-full transition-colors
			  duration-75 ease-in-out  outline-none hover:bg-blue-600 cursor-pointer disabled:bg-gray-300'
				 >
					 {mutation.isPending ? 'Смена пароля...' : 'Поменять пароль' }
				 </Button>
			 </>
			}
		</form>
	)
}