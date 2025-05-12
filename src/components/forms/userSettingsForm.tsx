import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {TupdateUserSchema, updateUserSchema} from "@/schemas/auth/UserSchema";
import {useMutation} from "@tanstack/react-query";
import axios from "axios";
import {Input} from "@/components/Input";
import {Button} from "@headlessui/react";
import {handleSignOut} from "@/utils/signOutAction";


interface TUser {
	id: number,
	name: string,
	surname: string,
	email: string,
	login: string,
	avatar_url: string | null,
	created_at: string
}

const UserSettignsForm = ({user}: {user: TUser}) => {
	const {
		register,
		handleSubmit,
		formState: {errors},
		setError,
	} = useForm({
		resolver: zodResolver(updateUserSchema),
		defaultValues: {
			name: user.name,
			surname: user.surname,
			email: user.email,
			login: user.login,
		},
		mode: 'onChange'
	})

	const mutation = useMutation({
		mutationFn: async (data: TupdateUserSchema) => {
			const result = await axios.put(`/api/users/${user.id}`, data);
		},
		onError: (error) => {
			if (axios.isAxiosError(error)) {
				const message = error.response?.data?.error;

				if (message === "Неверный текущий пароль") {
					setError("currentPassword", {
						type: "manual",
						message,
					});
				} else {
					console.error("Ошибка:", message);
				}
			}
		},
	})


	function onSubmit(data: TupdateUserSchema) {
		mutation.mutate(data);
		console.log('попытка');
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<Input
					{...register('name')}
					label="Имя"
					name="name"
					error={errors.name}
				/>
				<Input
					{...register('surname')}
					label="Фамилия"
					name="surname"
					error={errors.surname}
				/>
				<Input
					{...register('login')}
					label="Имя аккаунта"
					name="login"
					error={errors.login}
				/>
				<Input
					{...register('email')}
					label="E-mail"
					name="email"
					type="email"
					error={errors.email}
				/>
			</div>

			<div>
				<h2 className="text-lg font-semibold mb-4">Пароль</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<Input
						{...register('currentPassword')}
						label="Существующий пароль"
						name="currentPassword"
						type="password"
						placeholder="******"
						error={errors.currentPassword}
					/>
					<div />
					<Input
						{...register('newPassword')}
						label="Новый пароль"
						name="newPassword"
						type="password"
						placeholder="******"
						error={errors.newPassword}
					/>
					<Input
						{...register('confirmNewPassword')}
						label="Повторите пароль"
						name="confirmNewPassword"
						type="password"
						placeholder="******"
						error={errors.confirmNewPassword}
					/>
				</div>
			</div>
			<div className='mt-10 flex flex-row-reverse justify-between items-center'>
				<Button
					type='submit'
					className='
					text-white bg-blue-500 text-[14px]
					  rounded-sm p-2 transition-colors duration-75 ease-in-out outline-none
					hover:bg-blue-600 cursor-pointer disabled:bg-gray-300
					  '>
					Обновить данные
				</Button>
				<button
					onClick={async () => {
						await handleSignOut();
					}}
					className="text-blue-500 hover:cursor-pointer hover:text-red-500"
				>
					выйти из аккаунта
				</button>
			</div>
		</form>
	);
};

export default UserSettignsForm;