import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from './jwt'

export async function protectApiRoute() {
	const cookieStore = await cookies()
	const token = cookieStore.get('token')?.value

	if (!token) {
		return NextResponse.json(
			{ error: 'Не авторизован' },
			{ status: 401 }
		)
	}

	try {
		verifyToken(token)
		return null

	} catch (error) {
		return NextResponse.json(
			{
				message: 'Невалидный токен',
				error: error
			},
			{ status: 403 }
		)
	}
}