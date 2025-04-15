import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";

const UpdateCommentSchema = z.object({
    content: z.string().min(1, "Комментарий не может быть пустым")
});

// PUT /api/comments/:id - обновление комментария
export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json({ error: "Необходима авторизация" }, { status: 401 });
        }

        const existingComment = await prisma.comment.findUnique({
            where: { id: Number(params.id) }
        });

        if (!existingComment || existingComment.user_id !== Number(currentUser.id)) {
            return NextResponse.json({ error: "Нет доступа к редактированию" }, { status: 403 });
        }

        const body = await req.json();
        const validation = UpdateCommentSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 });
        }

        const updated = await prisma.comment.update({
            where: { id: Number(params.id) },
            data: { content: validation.data.content }
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("[COMMENT_PUT]", error);
        return NextResponse.json({ error: "Ошибка при обновлении комментария" }, { status: 500 });
    }
}

// DELETE /api/comments/:id - удаление комментария
export async function DELETE(
    _req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json({ error: "Необходима авторизация" }, { status: 401 });
        }

        const existingComment = await prisma.comment.findUnique({
            where: { id: Number(params.id) }
        });

        if (!existingComment || existingComment.user_id !== Number(currentUser.id)) {
            return NextResponse.json({ error: "Нет доступа к удалению" }, { status: 403 });
        }

        await prisma.comment.delete({
            where: { id: Number(params.id) }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[COMMENT_DELETE]", error);
        return NextResponse.json({ error: "Ошибка при удалении комментария" }, { status: 500 });
    }
}
