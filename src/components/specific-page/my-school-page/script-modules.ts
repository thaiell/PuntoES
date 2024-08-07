import { and, db, eq, Forms, Schools } from "astro:db";

export const fetchForm = async (
    uid: string,
    currentSchool: number
  ): Promise<Response> => {
    try {
      const form = await db.select({
        id: Forms.id,
        fieldName: Forms.fieldName,
        fieldShirtSize: Forms.fieldShirtSize,
        fieldShirtQuantity: Forms.fieldShirtQuantity,
        fieldJacketSize: Forms.fieldJacketSize,
        fieldJacketQuantity: Forms.fieldJacketQuantity,
      }).from(Forms).where(
        and(
          eq(
            Forms.userUid, uid
          ),
          eq(
            Forms.schoolId, currentSchool
            )
        )
      )

      if(form.length === 0){
        return new Response(JSON.stringify(null), {
          status: 404,
          statusText: "Not found"
        })
      }
      return new Response(JSON.stringify(form[0]), {
        status: 200,
        statusText: "ok",
      });
    } catch (error) {
      console.error("Error fetching form: ", error);
      return new Response(
        JSON.stringify({ message: "Error trying to fetch form" }),
        {
          status: 404,
          statusText: "Unexpected error trying to fetch form",
        }
      );
    }
};