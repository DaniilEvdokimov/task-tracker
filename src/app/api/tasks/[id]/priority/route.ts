import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';


// PUT /api/tasks/:id/priority — изменение приоритета
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 });

        const { priority } = await req.json();
        const updated = await prisma.task.update({
            where: { id: Number(params.id) },
            data: { priority },
        });
        return NextResponse.json(updated);
    } catch (error) {
        console.error('[TASK_PRIORITY_PUT]', error);
        return NextResponse.json({ error: 'Ошибка при обновлении приоритета' }, { status: 500 });
    }
}
