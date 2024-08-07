import { useState } from "react";
import type { PriceBySizes, UserForm } from "../../../../types/school";
import type { UserData, UserPayment } from "../../../../types/global";
import PersonalDataForm from "./first-page/PersonalDataForm";
import DeliveryForm from "./second-page/DeliveryForm";
import PaymentForm from "./third-page/PaymentForm";

const Checkout = ({
  form,
  prices,
  user,
}: {
  form: UserForm;
  prices: PriceBySizes;
  user: UserData;
}) => {
  const [currentStep, setCurrentStep] = useState(1);

  const [userPaymentData, setUserPaymentData] = useState<UserPayment>({
    email: user.email,
    dni: user.dni,
    phoneNumber: user.dni,
    deliver: "puntoes-shop",
    paymentMethod: {
      instalments: 1,
      method: "cash",
    },
    address: {
      number: "",
      place: "",
      street: "",
      zipcode: "",
    },
  });

  type UserPaymentField = keyof UserPayment;
  type UserPaymentFieldType<T extends UserPaymentField> =
    T extends "paymentMethod"
      ? UserPayment["paymentMethod"]
      : T extends "address"
      ? UserPayment["address"]
      : UserPayment[T];

  const updatePaymentData = <T extends UserPaymentField>(
    field: T,
    value: UserPaymentFieldType<T> 
  ) => {
    setUserPaymentData((prev) => ({ ...prev, [field]: value }));
  };

  const staticPrices = {
    total:
      prices.shirt[form.fieldShirtSize] * form.fieldShirtQuantity +
      prices.jacket[form.fieldJacketSize] * form.fieldJacketQuantity,
    shirt: {
      unit_price: prices.shirt[form.fieldShirtSize],
      total: prices.shirt[form.fieldShirtSize] * form.fieldShirtQuantity,
    },
    jacket: {
      unit_price: prices.jacket[form.fieldJacketSize],
      total: prices.jacket[form.fieldJacketSize] * form.fieldJacketQuantity,
    },
  };
  return (
    <div className="relative flex flex-1 mx-5 max-w-2xl lg:min-h-96 flex-col rounded-xl overflow-hidden border divide-x border-gray-300 mt-6">
      <div className="flex justify-around my-2">
        {["Detalles", "Entrega", "Pago"].map((step, index) => (
          <span
            key={index}
            className={`${
              currentStep === index + 1
                ? "text-blue-600 font-bold"
                : "text-gray-500"
            }`}
          >
            {step}
          </span>
        ))}
      </div>

      {currentStep === 1 && (
        <PersonalDataForm
          nextStep={() => setCurrentStep(2)}
          updatePaymentData={updatePaymentData}
          prices={staticPrices}
          user={{ email: user.email, phone: user.phone, dni: user.dni }}
          userForm={form}
        />
      )}
      {currentStep === 2 && (
        <DeliveryForm
          nextStep={() => setCurrentStep(3)}
          updatePaymentData={updatePaymentData}
        />
      )}
      {currentStep === 3 && (
        <PaymentForm
        paymentData={userPaymentData}
        updatePaymentData={updatePaymentData}
        totalAmount={staticPrices.total}
        formId={form.id}
        shirtMPInfo={{ quantity: form.fieldShirtQuantity, unit_price: staticPrices.shirt.unit_price }}
        jacketMPInfo={{ quantity: form.fieldJacketQuantity, unit_price: staticPrices.jacket.unit_price }}
        lastname={user.lastname}
        name={user.name}
        />
      )}
    </div>
  );
};

export default Checkout;