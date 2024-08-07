import { db, PaymentOrder } from "astro:db";
import type { UserPayment } from "../types/global";
import { nanoid } from "nanoid";


export const createOrder = async (
    uid: string, 
    paymentMethod: UserPayment["paymentMethod"]["method"], 
    address: UserPayment["address"],
    formId: number, 
    totalAmount: number,
    externalReference: string,
): Promise<Response> => {
    try {
        const newOrder = await db.insert(PaymentOrder).values({
            id: nanoid(10),
            userUid: uid,
            formId: formId,
            totalAmount: totalAmount,
            paymentMethod: paymentMethod,

            address: address,

/*             transactionId: transactionId, */
            externalReference: externalReference,
            // file: {},

            date: new Date(),
/*             verified: false, */
            // status: 
        }).returning({ id: PaymentOrder.id })

        console.log(newOrder)

        // The new order has been successfully created 
        return new Response(JSON.stringify(newOrder[0].id), {
            status: 200,
            statusText: "ok"
        })
    } catch(error){
        console.error("Error while trying to create a new order");
        return new Response(JSON.stringify("Error inesperado mientras creabamos la orden"), {
            status: 404,
            statusText: "Unexpected error"
        })
    }

}