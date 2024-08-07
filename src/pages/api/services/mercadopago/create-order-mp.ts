import type { APIRoute } from "astro";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { apiRoutes } from "../../../../constants/constants";
import type { Items } from "mercadopago/dist/clients/commonTypes";
import type { Payer } from "mercadopago/dist/clients/preference/commonTypes";
import type { Address } from "../../../../types/global";
import { createOrder } from "../../../../lib/apiUtils";
import { nanoid } from "nanoid";

interface RequestBody {
    items: Items[]; 
    payer: Payer; 
    paymentDataAddress: Address; 
    formId: number; 
    totalAmount: number;
}
export const accesTokenCuentaIncognito = "APP_USR-2271234493641301-070201-319cc740649a37e18c1bace18d283607-1343355235"

const client = new MercadoPagoConfig({
    accessToken: accesTokenCuentaIncognito
})

export const POST: APIRoute = async ({ request, locals, redirect }): Promise<Response> => {    
    try {
        const { uid } = locals.user;
        if(!uid){
            return new Response(JSON.stringify("Intente iniciar sesión de nuevo e intente de nuevo"), {
                status: 404,
                statusText: "User not found"
            })
        }
        const { items, payer, paymentDataAddress, formId, totalAmount }: RequestBody = await request.json();
        const preference = new Preference(client)

        const externalReference = nanoid(10);

        const response = await preference.create({
            requestOptions: {
                
            },
            body: {
                shipments: {
                    cost: 100, /*  FALTA CONFIGURAR BIEN ESTO DEL SHIPMENT */
                    receiver_address: {

                    }
                },
                items: items,
                payer: payer,
                back_urls: {
                    success: `${apiRoutes.default}${apiRoutes.mercado_pago.onsuccess}`,
                    failure: `${apiRoutes.default}${apiRoutes.mercado_pago.onfailure}`,
                    pending: `${apiRoutes.default}${apiRoutes.mercado_pago.onpending}`
                },
                external_reference: externalReference, // Poner una external reference mejor
                notification_url: `${apiRoutes.mercado_pago.notification}`,
                auto_return: "approved", // Los compradores son redirigidos automáticamente al site cuando se aprueba el pago. El valor predeterminado es approved. El tiempo de redireccionamiento es de 40 segundos y esto no puede ser personalizado.
                payment_methods: {
                    excluded_payment_methods: [
                        {
                            id: "debcabal"
                        },
                        {
                            id: "maestro"
                        }
                    ],
                    excluded_payment_types: [
                        {
                            id: "credit_card"
                        }
                    ],
                    installments: 1
                }
            }
        })

        const preferenceId = response.id;

        await createOrder(
            uid,
            "mp",
            paymentDataAddress,
            formId,
            totalAmount,
            externalReference,
        );

       return redirect(`/pagos/${preferenceId}`);
    } catch(error){
        console.error("Error trying to make payment with uniforms", error);
        return new Response(JSON.stringify("Algo no salio todo cheto..."), {
            status: 404,
            statusText: "Unexpected error"
        })
    }
}