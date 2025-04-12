import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server'
import { z } from 'zod'

const createProjectSchema = z.object({
    name: z.string().min(1),
    created_by: z.number().int(),
    team_id: z.number().int(),
})

// GET api/projects - Получить все проекты
export async function GET() {
    try {
        const projects = await prisma.project.findMany({
            include: {
                team: true,
                createdBy: true,
            },
            orderBy: {
                created_at: 'desc',
            },
        })

        return NextResponse.json(projects)
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Ошибка сервера" },
            { status: 500 }
        );
    }
}

// POST api/projects Создать новый проект
export async function POST(req: Request) {
    try {
        const body = await req.json()
        const result = createProjectSchema.safeParse(body)

        if (!result.success) {
            return NextResponse.json({ error: result.error.flatten() }, { status: 400 })
        }

        const { name, created_by, team_id } = result.data

        const project = await prisma.project.create({
            data: { name, created_by, team_id },
        })

        return NextResponse.json(project, { status: 201 })
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Ошибка сервера" },
            { status: 500 }
        );
    }
}
