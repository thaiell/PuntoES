import type { APIRoute } from "astro";
import type { UserPayment } from "../../../types/global";
import { nanoid } from "nanoid";
import { createOrder } from "../../../lib/apiUtils";

interface RequestBody {
    userPayment: UserPayment;
    formId: number;
    totalAmount: number;
}

export const POST: APIRoute = async ({ request, locals }): Promise<Response> => {
    try {
        const { uid } = locals.user;
        if(!uid){
            return new Response(JSON.stringify("Intente iniciar sesión de nuevo e intente de nuevo"), {
                status: 404,
                statusText: "User not found"
            })
        }

        const data: RequestBody = await request.json();
        console.log(data);
        
        const paymentMethod = data.userPayment.paymentMethod.method;
        const address = data.userPayment.address;

        const res = await createOrder(
            uid, 
            paymentMethod, 
            address, 
            data.formId,
            data.totalAmount, 
            nanoid(10)
        )
        const resData = await res.json();
        console.log(res.status);
        console.log(resData);

        // Puedo extraer el id de compra, o alguna otra cosa y mostrarlo al usuario

        if(res.status !== 200){
            return new Response(JSON.stringify({ 
                message: resData, 
                orderId: resData 
            }), {
                status: res.status,
                statusText: "Error trying to create a new order"
            })
        }
        return new Response(JSON.stringify("Su pedido fue creado correctamente"), {
            status: 200,
            statusText: "ok"
        });
    } catch(error){
        console.error("Error trying to create a new order", error);
        return new Response(JSON.stringify("Error inesperado, intente de nuevo por favor"), {
            status: 404,
            statusText: "Unexpected error"
        })
    }
}