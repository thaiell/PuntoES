import React, { useCallback, useState } from "react";
import type { UserPayment } from "../../../../../types/global";
import { apiRoutes } from "../../../../../constants/constants";
import type { Items } from "mercadopago/dist/clients/commonTypes";
import type { Payer } from "mercadopago/dist/clients/preference/commonTypes";
import toast from "../../../../common/toast/toast";

const PaymentForm = ({ 
  paymentData,
  updatePaymentData,
  totalAmount,
  formId,
  shirtMPInfo,
  jacketMPInfo,
  name,
  lastname
}: {
  paymentData: UserPayment;
  updatePaymentData: (field: keyof UserPayment, value: any) => void;
  totalAmount: number;
  formId: number;
  shirtMPInfo: {unit_price: number; quantity: number};
  jacketMPInfo: {unit_price: number; quantity: number};
  name: string;
  lastname: string
}) => {
  const [paymentMethod, setPaymentMethod] = useState<UserPayment["paymentMethod"]["method"]>("mp");
  const [initialPayment, setInitialPayment] = useState<boolean>(true); // 50 / 50 option ONLY with CASH
  const [bankReceipt, setBankReceipt] = useState<File | null>(null);
  const [missingBankReceipt, setMissingBankReceipt] = useState<boolean>(false);

  const handlePaymentMethodSubmit = useCallback(() => {
    if (paymentMethod === "cash") {
      updatePaymentData("deliver", "puntoes-shop");
      updatePaymentData("paymentMethod", { method: paymentMethod, instalments: initialPayment ? 2 : 1 });
    } else {
      updatePaymentData("paymentMethod", { method: paymentMethod, instalments: 1 });
    }
  }, [paymentMethod, initialPayment, updatePaymentData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setBankReceipt(e.target.files[0]);
      // Do something
    }
  };

  const renderExtraData = {
/*  mp: () => <button>MP</button>, */
    cash: () => (
      <div className="mt-2">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={initialPayment}
            onChange={() => setInitialPayment(!initialPayment)}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <span className="ml-2 text-gray-700">Pagar 50% como seña</span>
        </label>
      </div>
    ),
    "bank-transfer": () => (
      <>
      <div className="mt-2">
        <label className="block text-sm font-medium text-gray-700">Adjuntar comprobante de transferencia:</label>
        <input
          type="file"
          onChange={(e) => handleFileChange(e)}
          className="mt-1 w-full shadow-md"
          />
      </div>
        {
          missingBankReceipt && <p className="text-red-500 text-sm w-3/6">
            Recuerde adjuntar el comprobante de pago una vez realizada la transferencia
          </p>
        }
      </>
    )
  };
// This functions handles an API to the server and redirects the user to make the payment in other page
  const handleMPPayment = async () => {
    try {
      const items: Items[] = [{
        id: "Remera Egresados",
        title: "Remera Egresados Uniforme",
        currency_id: "ARS",
        quantity: shirtMPInfo.quantity,
        unit_price: shirtMPInfo.unit_price
      },
      {
        id: "Campera Egresados",
        title: "Campera Egresados Uniforme",
        category_id: "ARS",
        quantity: jacketMPInfo.quantity,
        unit_price: jacketMPInfo.unit_price
      }
    ]
      const payer: Payer = {
        email: paymentData.email,
        name: name,
        surname: lastname,
        address: {
          street_name: paymentData.address?.street,
          street_number: paymentData.address?.number,
          zip_code: paymentData.address?.zipcode
        },
        phone: {
          area_code: "+54",
          number: paymentData.phoneNumber
        },

      }
      const response = await fetch(apiRoutes.mercado_pago.uniformsPayment, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          items: items,
          payer: payer,
          paymentDataAddress: paymentData.address,
          formId: formId,
          totalAmount: totalAmount
        })
      })

      if(response.redirected){
        return window.location.href = response.url;
      } else {
        const data = await response.json();
        console.log(data);
        toast.error("Intente de nuevo...", {
            position: "tr"
        });
      }
    } catch(error){
      console.error("Error trying to make Mercado Pago Payment", error)
    }
  }
  const handleBankAndCashFlow = async (method: UserPayment["paymentMethod"]["method"]) => {
    if(method === "bank-transfer"){
      setMissingBankReceipt(false);
      if(!bankReceipt){
        setMissingBankReceipt(true);
        return;
      }
    }
    try {
      console.log(`Making ${method} order...`)
      const response = await fetch(apiRoutes.school.createOrder, {
        method: "POST",
        body: JSON.stringify({
          userPayment: paymentData,
          formId: formId,
          totalAmount: totalAmount
        })
      })
    } catch(error){
      console.error("Unexpected error while trying to save a new order: ", error);
    }
  }

  // Data to build the buttons with all the wanted info
  const allPayingMethodData = [
    {
      label: "Mercado Pago",
      buttonLabel: "Continuar a Mercado Pago",
      value: "mp",
      instalments: 1,
      description: ["Su pago será automáticamente verificado luego de realizar el pago con MercadoPago."],
      // renderExtraData: renderExtraData.mp,
      action: handleMPPayment
    },
    {
      label: "Efectivo",
      buttonLabel: "Finalizar pedido",
      value: "cash",
      instalments: 1,
      description: ["El pago en efectivo se hace en nuestro local ubicado en Sanabria 4159.", "En efectivo puede realizar el 50% del pago como seña en nuestro local, y el 50% restante del pago una vez el producto se haya recibido."],
      renderExtraData: renderExtraData.cash,
      action: () => handleBankAndCashFlow("cash"),
    },
    {
      label: "Transferencia bancaria",
      buttonLabel: "Ya realicé la transferencia",
      value: "bank-transfer",
      instalments: 1,
      description: ["La transferencia bancaria debe ser realizada al CBU: 2083-9384", "Una vez hecha la transferencia, su pago quedará pendiente hasta que revisemos su pago."],
      renderExtraData: renderExtraData["bank-transfer"],
      action: () => handleBankAndCashFlow("bank-transfer"),
    },
  ];

  return (
    <form className="p-3 space-y-4 bg-white shadow-md rounded-md">
      <h2 className="text-center text-lg font-medium text-gray-700">Método de pago</h2>
      <div className="flex flex-col space-y-2">
        {allPayingMethodData.map((method, index) => {
          const isActive = (method.value === paymentMethod);
          return (
            <React.Fragment key={index}>
              <button
                type="button"
                className={`${isActive ? "bg-primary shadow-lg" : "bg-teal-200"} hover:bg-primary px-6 py-5 rounded-xl w-full transition-colors duration-200 active:shadow-lg flex justify-between items-center text-lg text-white`}
                onClick={() => setPaymentMethod(method.value as UserPayment["paymentMethod"]["method"])}
                >
                {method.label}
              </button>
              {isActive && (
                <div className="flex flex-col items-center p-4 bg-gray-100 rounded-lg shadow-inner">
                  {method.description.map((desc, descIndex) => (
                    <p className="w-4/5 text-gray-700" key={descIndex}>
                      {desc}
                    </p>
                  ))}
                  {method.renderExtraData && method.renderExtraData()}
                  <button
                    type="button"
                    onClick={() => {
                      handlePaymentMethodSubmit(); // This function updates the main state shared between component to ensure that only modifies if necesary when the user has chosen his prefered method
                      method.action();
                    }}
                    className="px-4 mt-5 py-2 text-white text-lg bg-primary rounded-lg w-1/2"
                  >
                    {method.buttonLabel}
                  </button>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </form>
  );
};

export default PaymentForm;