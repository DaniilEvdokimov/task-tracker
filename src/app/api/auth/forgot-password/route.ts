import { NextResponse } from 'next/server';
import { changePassword } from '@/model/user';

export async function POST(request: Request) {
	try {
		const { email, password } = await request.json();

		const result = await changePassword(email, password);

		if (!result.success) {
			return NextResponse.json(
				{ error: result.message },
				{ status: 400 }
			);
		}

		return NextResponse.json(result);
	} catch (error) {
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}