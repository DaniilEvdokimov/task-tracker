import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server'
import { z } from 'zod'

const updateProjectSchema = z.object({
    name: z.string().min(1).optional(),
    team_id: z.number().int().optional(),
})

// GET api/projects/id - Получить проект по ID
export async function GET(_: Request, { params }: { params: { id: string } }) {
    try {
        const id = Number(params.id)

        const project = await prisma.project.findUnique({
            where: { id },
            include: {
                team: true,
                createdBy: true,
            },
        })

        if (!project) {
            return NextResponse.json({ error: 'Проект не найден' }, { status: 404 })
        }

        return NextResponse.json(project)
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        } else {
            return NextResponse.json(
                { error: "Неизвестная ошибка" },
                { status: 500 }
            );
        }
    }
}

// PATCH api/projects/id - Обновить проект
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        const id = Number(params.id)
        const body = await req.json()

        const result = updateProjectSchema.safeParse(body)

        if (!result.success) {
            return NextResponse.json({ error: result.error.flatten() }, { status: 400 })
        }

        const updated = await prisma.project.update({
            where: { id },
            data: result.data,
        })

        return NextResponse.json(updated)
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        } else {
            return NextResponse.json(
                { error: "Неизвестная ошибка" },
                { status: 500 }
            );
        }
    }
}

// DELETE api/projects/id Удалить проект
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
    try {
        const id = Number(params.id)

        await prisma.project.delete({
            where: { id },
        })

        return NextResponse.json({ message: "Проект удален" })
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        } else {
            return NextResponse.json(
                { error: "Неизвестная ошибка" },
                { status: 500 }
            );
        }
    }
}
