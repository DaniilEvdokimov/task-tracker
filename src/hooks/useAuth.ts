import { useQuery, useQueryClient } from '@tanstack/react-query'
import axios from "axios";

export function useAuth() {
	const queryClient = useQueryClient()

	const { data: authState } = useQuery({
		queryKey: ['auth'],
		queryFn: async () => {
			try {
				const { data } = await axios.get('/api/auth/me');
				return {
					isAuthenticated: !!data.user,
					isInitialized: true,
					user: data.user
				};
			} catch {
				return { isAuthenticated: false, isInitialized: true };
			}
		},
		initialData: { isAuthenticated: false, isInitialized: false }
	});

	const login = (user: any) => {
		queryClient.setQueryData(['auth'], {
			isAuthenticated: true,
			isInitialized: true,
			user
		});
	};

	const logout = () => {
		document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
		queryClient.setQueryData(['auth'], {
			isAuthenticated: false,
			isInitialized: true
		})
	}

	return {
		...authState,
		login,
		logout
	}
}