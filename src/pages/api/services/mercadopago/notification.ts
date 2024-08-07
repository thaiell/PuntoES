import type { APIRoute } from "astro";
import { MercadoPagoConfig, Payment, MerchantOrder } from "mercadopago";
import { accesTokenCuentaIncognito } from "./create-order-mp";
import { db, eq, PaymentOrder } from "astro:db";

const client = new MercadoPagoConfig({
  accessToken: accesTokenCuentaIncognito,
});

export const POST: APIRoute = async ({ request }): Promise<Response> => {
  try {
    const body = await request.json();
    const queryParams = new URL(request.url).searchParams;

    const payment = new Payment(client);
    // const merchant_order = new MerchantOrder(client);

    const topic = queryParams.get("type");

    switch (topic) {
      case "payment":
        console.log("Payment Notification Received");
        console.log(request.url);
        console.log(body);

        const paymentId = body.data?.id;
        console.log(paymentId)
        if (!paymentId) {
          throw new Error("Payment ID is missing from the notification");
        }

        const userPayment = await payment.get({ id: paymentId });
        console.log("Payment Status:", userPayment.status);
        console.log("Payment Status Detail:", userPayment.status_detail);
        console.log("Merchant Order ID:", userPayment.order?.id);
        console.log("Money Release Status:", userPayment.money_release_status);
        console.log("Money Release Schema:", userPayment.money_release_schema);

        await db.update(PaymentOrder).set({
            transactionId: userPayment.id,
            status: userPayment.status
        }).where(eq(PaymentOrder.externalReference, userPayment.external_reference as string))

        break;
       /*
       case "merchant_order":
        console.log("Merchant Order Notification Received");
        console.log(request.url);
        console.log(body);

        const merchantOrderId = queryParams.get("data.id") || body.data?.id;
        console.log(merchantOrderId);
        if (!merchantOrderId) {
          throw new Error("Merchant Order ID is missing from the notification");
        }

        const userMerchantOrder = await merchant_order.get({
          merchantOrderId: Number(merchantOrderId),
        });
        console.log("Merchant Order:", userMerchantOrder); */
        break;

      default:
        console.log("Unknown Notification Type");
        console.log(request.url);
        console.log(body);
        break;
    }

    return new Response(null, {
      status: 200,
      statusText: "ok",
    });
  } catch (error) {
    console.error("Error handling Mercado Pago notification: ", error);
    return new Response(null, {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
};

// export const POST: APIRoute = async ({ request }): Promise<Response> => {

//     const body = await request.json();
//     const queryParams = new URL(request.url).searchParams;
//     const payment = new Payment(client);

//     const topic = queryParams.get("topic") || queryParams.get("type");
//   console.log(topic)
//     if(topic === "payment"){
//         console.log(request.url);
//         console.log(body)

//     } else if(topic === "merchant_order"){
//         console.log(request.url);
//         console.log(body)
//     } else if(queryParams.get("type") === "payment") {
//         console.log("Something wasn't expected");
//         console.log(request.url)
//         console.log(body)

//         console.log(body.id)
//         console.log(body.data.id)
//         try {
//             const pago = await payment.get({ id: body.data.id })

//             console.log(pago.money_release_status);
//             console.log(pago.money_release_date);
//             console.log(pago.status);
//             console.log(pago.status_detail);
//             console.log(pago.external_reference);

//             const updating = await db.update(PaymentOrder).set({
//                 transactionId: pago.id,
//                 status: pago.status
//             }).where(eq(PaymentOrder.externalReference, pago.external_reference as string))
//             console.log(updating);

//             switch(pago.status){
//               case "pending":
//                 /* Enviar email por ejemplo */
//                 break;
//               case "in_proccess":
//                 /* Enviar email por ejemplo */
//                 break;
//               case "rejected":
//                 /* Enviar email por ejemplo */
//                 break;
//               default:
//                 break;
//             }
//         } catch(error){
//             console.log(error)
//         }
//     }

//     return new Response(null, {
//         status: 200,
//         statusText: "ok"
//     })
// }
