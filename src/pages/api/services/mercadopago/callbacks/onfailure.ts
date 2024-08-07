import type { APIRoute } from "astro";
import { db, PaymentOrder, eq } from "astro:db"




export const GET: APIRoute = async ({ request }): Promise<Response> => {

    const queryParams = new URL(request.url).searchParams;

    const paymentId = queryParams.get("payment_id");
    const status = queryParams.get("status");
    const preferenceId = queryParams.get("preference_id");
    const paymentType = queryParams.get("payment_type");
    console.log("paymentId: ", paymentId);
    console.log("status: ", status);


    return new Response(JSON.stringify({ 
        message: "Pago exitoso",
        paymentId,
        status
    }), {
        status: 200,
        statusText: "ok"
    })
}