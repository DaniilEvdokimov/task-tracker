'use client';

import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import Camera from "@/components/svg/Camera";
import UserSettignsForm from "@/components/forms/userSettingsForm";

// Интерфейс для пропсов модального окна
interface AvatarModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (url: string) => void;
	isLoading: boolean;
}

// Модальное окно для ввода URL аватара
const AvatarModal: React.FC<AvatarModalProps> = ({ isOpen, onClose, onSubmit, isLoading }) => {
	const [url, setUrl] = useState('');

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (url.trim()) {
			onSubmit(url.trim());
			setUrl('');
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
				<h2 className="text-lg font-semibold mb-4">Изменить аватар</h2>
				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label htmlFor="avatar-url" className="block text-sm font-medium text-gray-700 mb-2">
							URL изображения
						</label>
						<input
							id="avatar-url"
							type="url"
							value={url}
							onChange={(e) => setUrl(e.target.value)}
							placeholder="https://example.com/avatar.jpg"
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							required
							disabled={isLoading}
						/>
					</div>
					<div className="flex justify-end space-x-3">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
							disabled={isLoading}
						>
							Отмена
						</button>
						<button
							type="submit"
							className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
							disabled={isLoading || !url.trim()}
						>
							{isLoading ? 'Сохранение...' : 'Сохранить'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

const UserSettings = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const queryClient = useQueryClient();

	const {data, isPending, isError, error} = useQuery({
		queryKey: ['getUserCurrent'],
		queryFn: async () => {
			const res = await axios.get('/api/users/me');
			return await axios.get(`/api/users/${res.data.id}`);
		}
	});

	// Мутация для обновления аватара
	const updateAvatarMutation = useMutation({
		mutationFn: async (avatarUrl: string) => {
			const userRes = await axios.get('/api/users/me');
			const userId = userRes.data.id;

			const response = await axios.put(`/api/users/${userId}`, {
				...data?.data,
				avatar_url: avatarUrl
			});
			return response.data;
		},
		onSuccess: () => {
			// Обновляем кэш запроса
			queryClient.invalidateQueries({ queryKey: ['getUserCurrent'] });
			queryClient.invalidateQueries({ queryKey: ['fullUserInfo'] });
			setIsModalOpen(false);
		},
		onError: (error) => {
			console.error('Ошибка при обновлении аватара:', error);
			alert('Ошибка при обновлении аватара. Попробуйте еще раз.');
		}
	});

	const handleAvatarSubmit = (url: string) => {
		updateAvatarMutation.mutate(url);
	};

	if (isPending) {
		return <div>Загрузка...</div>
	}

	if (isError) {
		return <div>Ошибка {error.message}</div>
	}

	return (
		<div className='ml-6'>
			<h1 className='mb-5'>Настройки аккаунта</h1>
			<div className='bg-white max-w-1/2 rounded-md p-6 shadow-[0px_4px_8px_0px_#E5E7EB]'>
				<div className='relative'>
					{/* Аватарка */}
					<div className='w-30 h-30 rounded-full mb-5 overflow-hidden bg-gray-200'>
						{data.data.avatar_url ? (
							<img
								src={data.data.avatar_url}
								alt="Аватар пользователя"
								className="w-full h-full object-cover"
								onError={(e) => {
									// Если изображение не загрузилось, показываем заглушку
									const target = e.target as HTMLImageElement;
									target.style.display = 'none';
									const nextElement = target.nextElementSibling as HTMLElement;
									if (nextElement) {
										nextElement.style.display = 'flex';
									}
								}}
							/>
						) : null}
						{/* Заглушка если нет аватара или изображение не загрузилось */}
						<div
							className={`w-full h-full bg-black flex items-center justify-center text-white text-4xl font-semibold ${
								data.data.avatar_url ? 'hidden' : 'flex'
							}`}
						>
							{data.data.name ? data.data.name.charAt(0).toUpperCase() : '?'}
						</div>
					</div>

					{/* Кнопка камеры */}
					<div
						className='rounded-full bg-blue-500 inline-block p-3 absolute bottom-0 left-20 cursor-pointer hover:bg-blue-600 transition-colors'
						onClick={() => setIsModalOpen(true)}
					>
						<Camera />
					</div>
				</div>
				<UserSettignsForm key={data.data.id} user={data.data}/>
			</div>

			{/* Модальное окно */}
			<AvatarModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSubmit={handleAvatarSubmit}
				isLoading={updateAvatarMutation.isPending}
			/>
		</div>
	);
};

export default UserSettings;
