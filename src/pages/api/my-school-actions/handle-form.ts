import type { APIRoute } from "astro";
import { and, db, eq, Forms } from "astro:db";
import { createRandomNumberId } from "../../../lib/utils";

interface APIResponse {
  message: string;
}

export const POST: APIRoute = async ({
  request,
  locals
}): Promise<Response> => {
  try {
    
    const userUid = locals.user.uid;
    
    if (!userUid) {
      const response: APIResponse = {
        message: "Debe iniciar sesión primero",
      };
      return new Response(JSON.stringify(response), {
        status: 401,
        statusText: "No está iniciado sesión, intente iniciar sesión primero"
      });
    }



    const data = await request.json();

    const {
      id,
      shirtName,
      tshirtSize,
      tshirtQuantity,
      jacketSize,
      jacketQuantity,
    } = data;
    if (
      !shirtName ||
      !tshirtSize ||
      !tshirtQuantity ||
      !jacketSize ||
      !jacketQuantity
    ) {
      const response: APIResponse = {
        message: "Faltan campos requeridos",
      };
      return new Response(JSON.stringify(response), {
        status: 400,
        statusText: "Bad Request",
      });
    }

    const oldForm = await db
      .select()
      .from(Forms)
      .where(
        and(
          eq(Forms.id, id),
          eq(Forms.userUid, userUid)
        )); // Searchs for a Form that belongs to the user and to the right school

    if (oldForm.length > 0) { // If exists, updates the form
      const {
        fieldShirtSize,
        fieldShirtQuantity,
        fieldJacketSize,
        fieldJacketQuantity,
        fieldName,
      } = oldForm[0];

      if (
        shirtName === fieldName &&
        tshirtSize === fieldShirtSize &&
        tshirtQuantity === fieldShirtQuantity &&
        jacketSize === fieldJacketSize &&
        jacketQuantity === fieldJacketQuantity
      ) {
        const response: APIResponse = {
          message: "No hay necesidad de actualizar los datos",
        };
        return new Response(JSON.stringify(response), {
          status: 200,
          statusText: "Not new content",
        });
      }

      await db
        .update(Forms)
        .set({
          fieldName: shirtName,
          fieldShirtSize: tshirtSize,
          fieldShirtQuantity: tshirtQuantity,
          fieldJacketSize: jacketSize,
          fieldJacketQuantity: jacketQuantity,
        })
        .where(
          and(
            eq(Forms.schoolId, id),
            eq(Forms.userUid, userUid)
          )); // Updates Form

      const response: APIResponse = {
        message: "El formulario se ha actualizado correctamente",
      };
      return new Response(JSON.stringify(response), {
        status: 200,
        statusText: "OK",
      });
    } else { // If no form is found, this creates one
      const formSchema = {
        id: createRandomNumberId(),
        userUid: userUid,
        schoolId: id,
        fieldName: shirtName,
        fieldShirtSize: tshirtSize,
        fieldShirtQuantity: tshirtQuantity,
        fieldJacketSize: jacketSize,
        fieldJacketQuantity: jacketQuantity,
      };

      await db.insert(Forms).values(formSchema);

      const response: APIResponse = {
        message: "Formulario creado con éxito",
      };
      return new Response(JSON.stringify(response), {
        status: 201,
        statusText: "Created"
      });
    }
  } catch (error) {
    console.log("Error handling with form submit", error)
    const response: APIResponse = {
      message: "Algo ha ocurrido",
    };
    return new Response(JSON.stringify(response), {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
};
