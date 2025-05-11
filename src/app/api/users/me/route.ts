import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

// Get api/users/me - получить информация о текущем пользователе
export async function GET() {
    const user = await getCurrentUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(user);
}
