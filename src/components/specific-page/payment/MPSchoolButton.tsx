import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import { useState, useEffect } from "react"
import type { Items } from "mercadopago/dist/clients/commonTypes";
import type { Payer } from "mercadopago/dist/clients/preference/commonTypes";

const MPSchoolButton = ( { paramPreferenceId } : { paramPreferenceId: string } ) => {

    const [preferenceId, setPreferenceId] = useState<string>(paramPreferenceId);
    console.log(preferenceId)
    useEffect(() => {
        initMercadoPago("APP_USR-e89ba29f-48c0-4de6-a457-87d939897427", {
            locale: "es-AR",
        });
        /* const createPreference = async () => {
            try {
                const response = await fetch("/api/services/mercadopago/create-order", {
                    method: "POST",
                    body: JSON.stringify({
                        items,
                        payer
                    }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
    
                const data = await response.json();
                const id = data;
    
                if(id){
                    setPreferenceId(id);
                }
                return;
            } catch(error){
                console.log("Error creando pago", error);
            }
        }

        console.log("AOSLD")
        createPreference(); */
    }, [])

    return (
        <>
        { preferenceId && (
        <div className="min-h-14">
            <Wallet 
            initialization={{ 
                preferenceId: preferenceId,
                redirectMode: "modal",
                marketplace: true
            }}
            customization={{
                texts: {
                    action: "pay",
                    valueProp: "security_safety"
                },
                visual: {
                    hideValueProp: false,
                    buttonBackground: 'default', // default, black, blue, white
                    valuePropColor: 'grey', // grey, white
                    buttonHeight: '48px', // min 48px - max free
                    borderRadius: '6px',
                    verticalPadding: '16px', // min 16px - max free
                        horizontalPadding: '0px', // min 0px - max free
                    },
                    checkout: {
                        theme: {
                            elementsColor: '#4287F5', // color hex code
                            headerColor: '#4287F5', // color hex code
                        }
                    }
                }}
                locale="es-AR" />
                </div>
                ) }
            </>
    )

}
export default MPSchoolButton