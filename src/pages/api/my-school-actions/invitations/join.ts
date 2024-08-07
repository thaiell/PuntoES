import type { APIRoute } from "astro";
import { db, eq, Invitations, Users } from "astro:db";
import { pageUrls } from "../../../../constants/constants";
import { searchParams } from "../../../../constants/constants";

export const POST: APIRoute = async ({ request, locals, redirect }): Promise<Response> => {
    const { uid } = locals.user;
    if (!uid) {
        return new Response(JSON.stringify({ message: "Intente iniciar sesión de nuevo e intente de nuevo" }), {
            status: 401,
            statusText: "User not found"
        });
    }

    const { code } = await request.json();
    if (!code) {
        return new Response(JSON.stringify({ message: "No se ha encontrado un código válido" }), {
            status: 400,
            statusText: "Code not found"
        });
    }

    const schoolInvitation = await db.select({ schoolId: Invitations.schoolId })
                                     .from(Invitations)
                                     .where(eq(Invitations.code, code));

    if (schoolInvitation.length === 0) {
        return new Response(JSON.stringify({ message: "Código expirado o inválido" }), {
            status: 404,
            statusText: "Not valid code"
        });
    }

    const newSchoolId = schoolInvitation[0].schoolId;
    const user = await db.select({ schoolID: Users.schoolID })
                        .from(Users)
                        .where(eq(Users.uid, uid));

    if (user.length === 0) {
        return new Response(JSON.stringify({ message: "Intente iniciar sesión primero" }), {
            status: 401,
            statusText: "User not found"
        });
    }

    const currentSchoolIds = user[0].schoolID as number[];
    const updatedSchoolIds = Array.from(new Set([...currentSchoolIds, newSchoolId]));

    await db.update(Users)
            .set({ schoolID: updatedSchoolIds })
            .where(eq(Users.uid, uid));

    console.log("ALL GOOD");

    return redirect(`${pageUrls.my_school.default}?${searchParams.schoolQuery}=${newSchoolId}`);
};
