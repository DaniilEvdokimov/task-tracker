'use client';

import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import Camera from "@/components/svg/Camera";
import UserSettignsForm from "@/components/forms/userSettingsForm";


const UserSettings = () => {
	const {data, isPending, isError, error} = useQuery({
		queryKey: ['getUserCurrent'],
		queryFn: async () => {
			const res = await axios.get('/api/users/me');
			return await axios.get(`/api/users/${res.data.id}`);
		}
	})

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
					{/*Заглушка аватарки*/}
					<div className='bg-black w-30 h-30 rounded-full mb-5' />
					{/*Реализовать, когда будет аватарка будет передаваться файлом*/}
					<Camera />
				</div>
				<UserSettignsForm user={data.data}/>
			</div>
		</div>
	);
};

export default UserSettings;
