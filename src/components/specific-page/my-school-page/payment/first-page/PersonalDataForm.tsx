import { useState, type FormEvent } from "react";
import toast from "../../../../common/toast/toast";
import type { UserForm } from "../../../../../types/school";
import type { UserPayment } from "../../../../../types/global";

const PersonalDataForm = ({
  nextStep,
  updatePaymentData,
  prices,
  user,
  userForm,
}: {
  nextStep: () => void;
  updatePaymentData: (field: keyof UserPayment, value: any) => void;
  prices: {
    total: number;
    shirt: { unit_price: number; total: number };
    jacket: { unit_price: number; total: number };
  };
  user: { email: string; dni: string; phone: string };
  userForm: UserForm;
}) => {
  const [formData, setFormData] = useState({
    email: user.email,
    dni: user.dni,
    phoneNumber: user.phone,
    termsAndConditions: false,
  });
  const [errors, setErrors] = useState({
    email: false,
    dni: false,
    phoneNumber: false,
    termsAndConditions: false,
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateFields = () => {
    const newErrors = {
      email: !formData.email,
      dni: !formData.dni,
      phoneNumber: !formData.phoneNumber,
      termsAndConditions: !formData.termsAndConditions,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateFields()) {
      updatePaymentData("email", formData.email);
      updatePaymentData("dni", formData.dni);
      updatePaymentData("phoneNumber", formData.phoneNumber);
      nextStep();
    } else {
      toast.error("Por favor, completa todos los campos.");
    }
  };

  return (
    <>
      {/* Left Side */}
      <div className="h-48">
        <table className="w-full h-full divide-y divide-gray-200">
          <thead className="bg-gray-50 text-left text-xs text-gray-500 uppercase">
            <tr>
              <th className="px-6 py-3 tracking-wider">Tu Pedido</th>
              <th className="px-6 py-3 tracking-wider">Talle</th>
              <th className="px-6 py-3 tracking-wider">Cantidad</th>
              <th className="px-6 py-3 tracking-wider">Precio</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-sm text-gray-900">
            <tr>
              <td className="px-6 py-4">Remera</td>
              <td className="px-6 py-4">{userForm.fieldShirtSize}</td>
              <td className="px-6 py-4">{userForm.fieldShirtQuantity}</td>
              <td className="px-6 py-4">${prices.shirt.total}</td>
            </tr>
            <tr>
              <td className="px-6 py-4 border-b">Campera</td>
              <td className="px-6 py-4 border-b">{userForm.fieldJacketSize}</td>
              <td className="px-6 py-4 border-b">
                {userForm.fieldJacketQuantity}
              </td>
              <td className="px-6 py-4 border-b">${prices.jacket.total}5000</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Right Side */}
      <form onSubmit={handleSubmit}>
        <div className="p-5 flex justify-between flex-col min-h-80">
          <p className="text-sm text-gray-500 uppercase font-medium cursor-pointer top-3 left-5">
            Número de Pedido: 3473845738
          </p>
          <h2 className="text-xl text-gray-800 text-center mt-8">
            Completar datos para facturación
          </h2>

          <div className="flex flex-col justify-around mt-8 space-y-2">
            <div className="flex flex-col">
              <label htmlFor="email">Email:</label>
              <input
                type="text"
                name="email"
                defaultValue={formData.email}
                className="pl-3 pr-3 py-2 border-2 border-gray-300 bg-gray-50 rounded-md focus:outline-none focus:border-primary"
                placeholder="Dirección de correo electrónico"
              />
              {errors.email && (
                <p className="text-red-400 text-sm">
                  Este campo es obligatorio
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <label htmlFor="dni">DNI:</label>
              <input
                type="text"
                name="dni"
                defaultValue={formData.dni}
                onChange={(e) => handleInputChange(e)}
                maxLength={8}
                minLength={8}
                className="pl-3 pr-3 py-2 border-2 border-gray-300 bg-gray-50 rounded-md focus:outline-none focus:border-primary"
                placeholder="DNI"
              />
            </div>
            {errors.dni && (
              <p className="text-red-400 text-sm">Este campo es obligatorio</p>
            )}
            <div className="flex flex-col">
              <label htmlFor="phoneNumber">Número de teléfono:</label>
              <input
                type="text"
                name="phoneNumber"
                defaultValue={formData.phoneNumber}
                maxLength={10}
                className="pl-3 pr-3 py-2 border-2 border-gray-300 bg-gray-50 rounded-md focus:outline-none focus:border-primary"
                placeholder="Número de teléfono"
              />
              {errors.phoneNumber && (
                <p className="text-red-400 text-sm">
                  Este campo es obligatorio
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2 mt-10">
            <p className="text-lg text-gray-900">
              Total a pagar: ${prices.total}
            </p>

            <div className="flex gap-2">
              <input
                type="checkbox"
                name="termsAndConditions"
                defaultChecked={formData.termsAndConditions}
                onChange={(e) => handleInputChange(e)}
              />

              <span>
                Acepto los{" "}
                <a href="" className="underline text-link">
                  términos y condiciones
                </a>
              </span>
            </div>

            <button
              type="submit"
              disabled={!formData.termsAndConditions}
              className="text-center w-full py-2 bg-primary text-white rounded-lg font-medium"
            >
              Continuar
            </button>
          </div>
        </div>
      </form>
    </>
  );
};
export default PersonalDataForm;
