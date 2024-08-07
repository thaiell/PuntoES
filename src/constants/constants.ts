export const cookieRedirectPathValue = "destPath"
export const allIds = "schools-ids"
export const lastSchoolVisited = "lastSchoolVisited"

// export const iniciarSesion = "/iniciar-sesion"

export const sizesValues = ["XS", "S", "M", "L", "XL", "XXL"];
export const quantitiesValues = [1, 2, 3, 4, 5];

export const searchParams = {
    schoolQuery: "escuela",
    schoolActiveSection: "busq",
}
/* export const searchParamsValues = {
    schoolActiveForm: "form"
} */

export const pageUrls = {
    default: "http://localhost:4321",
    signIn: "/iniciar-sesion",
    signUp: "/register",
    invitation: "/invitacion",
    my_school: {
        default: "/mi-escuela",
        form_page: "/mi-escuela/formulario",
        payment_page: "/mi-escuela/compra",
        deliver_page: "/mi-escuela/envio"
    },
    payments: {
        default: "/pagos",
/*         mpPreferenceId: (preferenceId: string) => `/pagos/${preferenceId}` */
    }
}
export const ngrokRootUrl = "https://409e-201-231-102-209.ngrok-free.app"

export const apiRoutes = {
    default: "http://localhost:4321",
    mercado_pago: {
        default: "/api/services/mercadopago",
        uniformsPayment: "/api/services/mercadopago/create-order-mp",
        onsuccess:"/api/services/mercadopago/callbacks/onsuccess",
        onfailure: "/api/services/mercadopago/callbacks/onfailure",
        onpending: "/api/services/mercadopago/callbacks/onpending",
        notification: `${ngrokRootUrl}/api/services/mercadopago/notification`
    },
    auth: "/api/auth",
    school: {
        default: "/api/my-school-actions",
        handleForm: "/api/my-school-actions/handle-form",
        createOrder: "/api/my-school-actions/create-order",
        joinIntoSchool: "/api/my-school-actions/invitations/join"
    }
}
