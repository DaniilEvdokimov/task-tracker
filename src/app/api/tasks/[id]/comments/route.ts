import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";

const CreateCommentSchema = z.object({
    content: z.string().min(1, "Комментарий не может быть пустым")
});

// POST /api/tasks/id/comments - добавление комментария
export async function POST(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json({ error: "Необходима авторизация" }, { status: 401 });
        }

        const body = await req.json();
        const validation = CreateCommentSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 });
        }

        const comment = await prisma.comment.create({
            data: {
                content: validation.data.content,
                task_id: Number(params.id),
                user_id: Number(currentUser.id)
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        surname: true,
                        email: true,
                        avatar_url: true
                    }
                }
            }
        });

        return NextResponse.json(comment, { status: 201 });
    } catch (error) {
        console.error("[COMMENT_POST]", error);
        return NextResponse.json({ error: "Ошибка при добавлении комментария" }, { status: 500 });
    }
}

// GET /api/tasks/id/comments - список комментариев к задаче
export async function GET(
    _req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const comments = await prisma.comment.findMany({
            where: { task_id: Number(params.id) },
            orderBy: { created_at: "asc" },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        surname: true,
                        email: true,
                        avatar_url: true
                    }
                }
            }
        });

        return NextResponse.json(comments);
    } catch (error) {
        console.error("[COMMENT_GET]", error);
        return NextResponse.json({ error: "Ошибка при получении комментариев" }, { status: 500 });
    }
}
