import { useState, useEffect } from "react";
import type { DeliveryMethods, UserPayment } from "../../../../../types/global";
import toast from "../../../../common/toast/toast";

const DeliveryForm = ({
  nextStep,
  updatePaymentData,
}: {
  nextStep: () => void;
  updatePaymentData: (field: keyof UserPayment, value: any) => void;
}) => {
  const deliverOptions: {
    label: string;
    value: DeliveryMethods;
    price: string;
  }[] = [
    { label: "Retiro - Sanabria 2160", value: "puntoes-shop", price: "Gratis" },
    { label: "PuntoES", value: "puntoes-deliver", price: "Desde $3500" },
    { label: "Moova", value: "moova-deliver", price: "Desde $5000" },
  ];
  const [deliveryMethod, setDeliveryMethod] =
    useState<DeliveryMethods>("puntoes-shop");

  const [address, setAddress] = useState({
    street: "",
    number: "",
    place: "",
    zipcode: "",
  });

  useEffect(() => {
    updatePaymentData("deliver", deliveryMethod);
    if (deliveryMethod === "puntoes-shop") {
      updatePaymentData("address", {
        street: "",
        number: "",
        place: "",
        zipcode: "",
      });
    }
  }, [deliveryMethod]);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress((prevAddress) => ({ ...prevAddress, [name]: value }));
  };

  const validateForm = () => {
    if (
      !address.number ||
      !address.place ||
      !address.street ||
      !address.zipcode
    ) {
      toast.error("Complete todos los campos", {
        position: "tr",
      });
      console.log("IASDOIAS");
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (deliveryMethod !== "puntoes-shop") {
      if (!validateForm()) {
        return;
      }
      updatePaymentData("address", address);
    }
    nextStep();
  };

  return (
    <form className="p-3" onSubmit={handleSubmit}>
      <h2 className="text-center text-lg font-medium">Método de entrega</h2>
      <div className="flex p-2 gap-2">
        {deliverOptions.map((deliver, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setDeliveryMethod(deliver.value)}
            className={`relative transition-colors duration-200 flex-1 py-3 border text-lg rounded-lg ${
              deliveryMethod === deliver.value
                ? "bg-primary text-white font-medium"
                : "bg-slate-50 border-gray-300"
            }`}
          >
            <span className="absolute text-green-500 text-sm top-0 right-2">
              {deliver.price}
            </span>
            {deliver.label}
          </button>
        ))}
      </div>

      {deliveryMethod === "puntoes-shop" && ( // Render retiro por PuntoES
        <div>
          <iframe
            className="w-full"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14724.60088598352!2d-58.500871605773085!3d-34.62679949147857!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcc9c120930eb3%3A0xffd3417083a680e7!2sPuntoES%20Uniformes!5e0!3m2!1ses-419!2sar!4v1720824577623!5m2!1ses-419!2sar"
            width={650}
            height={450}
            style={{ border: "0" }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      )}

      {deliveryMethod !== "puntoes-shop" && (
        <div className="flex flex-col space-y-2">
          <div className="flex flex-col">
            <label htmlFor="place">Provincia:</label>
            <input
              type="text"
              name="place"
              className="pl-3 pr-3 py-2 border-2 border-gray-300 bg-gray-50 rounded-md focus:outline-none focus:border-primary"
              placeholder="Provincia, localidad, barrio"
              onChange={(e) => handleAddressChange(e)}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="street">Dirección:</label>
            <input
              type="text"
              name="street"
              className="pl-3 pr-3 py-2 border-2 border-gray-300 bg-gray-50 rounded-md focus:outline-none focus:border-primary"
              placeholder="Dirección"
              onChange={(e) => handleAddressChange(e)}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="number">Número:</label>
            <input
              type="text"
              name="number"
              className="pl-3 pr-3 py-2 border-2 border-gray-300 bg-gray-50 rounded-md focus:outline-none focus:border-primary"
              placeholder="Número de dirección"
              onChange={(e) => handleAddressChange(e)}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="zipcode">Codigo de área:</label>
            <input
              type="text"
              name="zipcode"
              className="pl-3 pr-3 py-2 border-2 border-gray-300 bg-gray-50 rounded-md focus:outline-none focus:border-primary"
              placeholder="Código de área"
              onChange={(e) => handleAddressChange(e)}
            />
          </div>
        </div>
      )}
      <button
        type="submit"
        className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-md shadow-sm"
      >
        Continuar
      </button>
    </form>
  );
};
export default DeliveryForm;
