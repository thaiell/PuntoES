import { useState, useRef, useCallback, type FormEvent } from "react"
import type { APIResponse, UserForm } from "../../../types/global"
import { sizesValues, quantitiesValues } from "../../../constants/constants"
import { removeExtraSpaces } from "../../../lib/utils";
import toast from "../../common/toast/toast";


const SchoolForm = ({ 
    form, 
    schoolId 
}: { 
    form: UserForm | null,
    schoolId: number 
}) => {
    const dbFormRef = useRef<UserForm | null>(form);

    const [responseLoading, setResponseLoading] = useState<boolean>(false);
    const [formData, setFormData] = useState<UserForm | null>({ // State filled with the form that is passed by parameters
        fieldName: form?.fieldName || "",
        fieldShirtSize: form?.fieldShirtSize || "XS",
        fieldJacketSize: form?.fieldJacketSize || "XS",
        fieldShirtQuantity: form?.fieldShirtQuantity || 1,
        fieldJacketQuantity: form?.fieldJacketQuantity || 1,
    })
    const [isFieldEmpty, setIsFieldEmpty] = useState({ // State for handle error empty fields
        shirtName: false,
        tshirtSize: false,
        tshirtQuantity: false,
        jacketSize: false,
        jacketQuantity: false
    })


    const handlerFormSubmit = useCallback(async(e: FormEvent<HTMLFormElement>) => { // Handler when the form is submitted
        e.preventDefault();
        
        const reviseData = isDataNeeded();
        if(!reviseData) return; // If no data is needed return - The error already is handled by isDataNeeded function

        setResponseLoading(true);
        try {
            const res = await fetch("/api/my-school-actions/handle-form", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(reviseData)
            });

            const response: APIResponse = await res.json();
            if(res.ok){
                toast.success(response.message, {
                    duration: 2000,
                    position: "tr"
                });
                dbFormRef.current = {
                    fieldName: reviseData.shirtName,
                    fieldShirtSize: reviseData.tshirtSize || "",
                    fieldShirtQuantity: reviseData.tshirtQuantity || 0,
                    fieldJacketSize: reviseData.jacketSize || "",
                    fieldJacketQuantity: reviseData.jacketQuantity || 0
                }; // Update the reference after successful submission
            } else {
                toast.error(response.message, {
                    duration: 2000,
                    position: "tr"
                });
            }
        } catch (error) {
            console.log(error)
            toast.error("Ha ocurrido un error inesperado, intente de nuevo :)", {
                position: "tr"
            })
        } finally {
            setResponseLoading(false);
        }

    }, [formData])
    
const isDataNeeded = () => { // Determines if data is in the correct format and if is needed - Returns false or the data
        setIsFieldEmpty({ // Reset error empty fields to false
            shirtName: false,
            tshirtSize: false,
            tshirtQuantity: false,
            jacketSize: false,
            jacketQuantity: false
        })

        const cleanData = { // Remove not wanted spaces
            schoolId: schoolId,
            shirtName: removeExtraSpaces(formData?.fieldName),
            tshirtSize: formData?.fieldShirtSize,
            jacketSize: formData?.fieldJacketSize,
            tshirtQuantity: formData?.fieldShirtQuantity,
            jacketQuantity: formData?.fieldJacketQuantity
        };

        const existEmptyFields = {
            shirtName: !cleanData.shirtName,
            tshirtSize: !cleanData.tshirtSize,
            tshirtQuantity: !cleanData.tshirtQuantity,
            jacketSize: !cleanData.jacketSize,
            jacketQuantity: !cleanData.jacketQuantity
        }
        setIsFieldEmpty(existEmptyFields) // If a field exists, will set in the State FALSE. If Doesn't exist, will set TRUE in the STATE

        const someFieldIsEmpty = Object.values(existEmptyFields).some(isEmpty => isEmpty); // Returns true if any field is empty

        if(someFieldIsEmpty){
            toast.error("Complete todos los campos", {
                duration: 2000,
                position: "tr"
            })
            return false;
        }

        // All fields are filled

        const dbForm = dbFormRef.current; // If data is equal to the previous update, returns false
        if (
            cleanData.shirtName === dbForm?.fieldName &&
            cleanData.tshirtSize === dbForm?.fieldShirtSize &&
            cleanData.tshirtQuantity === dbForm?.fieldShirtQuantity &&
            cleanData.jacketSize === dbForm?.fieldJacketSize &&
            cleanData.jacketQuantity === dbForm?.fieldJacketQuantity
        ) {
            toast.error("No hay cambios en los datos.", {
                duration: 2000,
                position: "tr"
            })
            return false;
        }

        // Not empty and not equal than before
        // Returns needed data
        return cleanData;
    }
    
    const handleInputChange = useCallback((field: keyof UserForm, value: string | number) => {
        setFormData(prevState => prevState ? { ...prevState, [field]: value || "" } : prevState);
    }, []);

    return (
<section className={"flex flex-1 justify-center items-center"}>  
    <form onSubmit={handlerFormSubmit} className="flex flex-col font-Ubuntu max-w-lg w-3/4">
        {/* NOMBRE DE LA REMERA */}
            <label htmlFor={"clothes-name-value"} className="mt-3">Nombre para la remera</label>
                <input 
                    type="text" 
                    id="clothes-name-value" 
                    aria-label="Nombre para las remeras" 
                    placeholder="Nombre tus emojis preferidos" 
                    className="border-gray-500 px-2 py-2 rounded-md border"
                    value={formData?.fieldName}
                    onChange={(e) => handleInputChange("fieldName", e.target.value)}
                />
                {isFieldEmpty.shirtName && <p className="text-red-500 text-sm">Complete este campo</p>} 
                {/* TALLE DE REMERA */}
                <label  className="mt-3">Talle de tu remera</label>
                <div className="flex space-x-1">
                    {sizesValues.map((value, index) => (
                        <button key={index} onClick={() => handleInputChange("fieldShirtSize", value)}
                        type="button"
                        className={`flex-1 border border-gray-200 rounded-md py-2 px-1 ${formData?.fieldShirtSize === value && "border-primary border-2 bg-lighterPrimary"}`}
                        >
                            {value.toUpperCase()}
                        </button>
                    ))}
                </div>
                {isFieldEmpty.tshirtSize && <p className="text-red-500 text-sm">Complete este campo</p>}

                {/* TALLE DE LA CAMPERA */}
                <label  className="mt-3">Talle de tu campera</label>
                <div className="flex space-x-1">
                    {sizesValues.map((value, index) => (
                        <button key={index} onClick={() => handleInputChange("fieldJacketSize", value)}
                        type="button"
                        className={`flex-1 border border-gray-200 rounded-md py-2 px-1 ${formData?.fieldJacketSize === value && "border-primary border-2 bg-lighterPrimary"}`}
                        >
                            {value.toUpperCase()}
                        </button>
                    ))}
                </div>
                {isFieldEmpty.jacketSize && <p className="text-red-500 text-sm">Complete este campo</p>}

                {/* CANTIDAD DE LA REMERA */}
                <label  className="mt-3">Cantidad de remeras</label>
                <div className="flex space-x-1">
                    {quantitiesValues.map((value, index) => (
                        <button key={index} onClick={() => handleInputChange("fieldShirtQuantity", value)}
                        type="button"
                        className={`flex-1 border border-gray-200 rounded-md py-2 px-1 ${formData?.fieldShirtQuantity === value && "border-primary border-2 bg-lighterPrimary"}`}
                        >
                            {value}
                        </button>
                    ))}
                </div>
                {isFieldEmpty.tshirtQuantity && <p className="text-red-500 text-sm">Complete este campo</p>}

                {/* CANTIDAD DE LA CAMPERA */}
                <label className="mt-3">Cantidad de camperas</label>
                <div className="flex space-x-1">
                    {quantitiesValues.map((value, index) => (
                        <button key={index} onClick={() => handleInputChange("fieldJacketQuantity", value)}
                        type="button"
                        className={`flex-1 border border-gray-200 rounded-md py-2 px-1 ${formData?.fieldJacketQuantity === value && "border-primary border-2 bg-lighterPrimary"}`}
                        >
                            {value}
                        </button>
                    ))}
                </div>
                {isFieldEmpty.jacketQuantity && <p className="text-red-500 text-sm">Complete este campo</p>}

                <button disabled={responseLoading} className={`rounded-md bg-primary from-green-500 bg-gradient-to-br py-1 w-3/4 self-center mt-7 ${responseLoading && "bg-opacity-55"}`}
                type="submit" aria-label="Enviar formulario">
                    {responseLoading ? "Loading..." : "Enviar"}
                </button>
            </form>
        </section>
    )
}
export default SchoolForm