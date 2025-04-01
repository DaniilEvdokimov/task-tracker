'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import Loader from '@/components/Loader'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
	const router = useRouter()
	const pathname = usePathname()
	const { isAuthenticated, isInitialized } = useAuth()

	useEffect(() => {
		if (!isInitialized) return

		const isPublicPath = ['/login', '/register'].includes(pathname)

		if (isAuthenticated && isPublicPath) {
			router.push('/')
		}
	}, [pathname, isAuthenticated, isInitialized, router])

	if (!isInitialized) return <Loader />

	return <>{children}</>
}