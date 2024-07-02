import { useEffect, useState } from "react";

interface SchoolExtendable {
  id: number
  name: string
}

const AccesToMySchools = ({ schoolCookies }: { schoolCookies: SchoolExtendable[] }) => {
  const [activeSchool, setActiveSchool] = useState<number>();


  useEffect(() => { /* Actualiza el estado activeSchool para desabilitar el boton sin uso */  
  const urlParams = new URLSearchParams(window.location.search)
  const valueParams = urlParams.get("escuela");
    
    if(valueParams) {
      setActiveSchool(Number(valueParams));
    } else {
      const lastSchoolCookie = window.document.cookie;
      const lastSchoolValue = lastSchoolCookie.split("lastSchoolVisited=")[1];
      setActiveSchool(Number(lastSchoolValue));
    }
  }, [])


  const handleClick = (id: number) => { /* Actualiza los parámetros de busqueda */
    const idFixed = id.toString();

    let params = new URLSearchParams(window.location.search)

    params.set("escuela", idFixed);
    window.location.search = params.toString();
  }

  return (
    <>
    {schoolCookies && schoolCookies.map((item, index) => {
    const disableButton: boolean = item.id === activeSchool ? true : false;
    return (
    <div key={index} className="flex items-center justify-between mt-4">
      <h2>
        {item.name}
      </h2>
      <button onClick={() => handleClick(item.id)} disabled={disableButton} className={`px-5 py-1.5 ${disableButton ? "bg-gray-400" : "bg-primary from-green-600"} bg-gradient-to-b rounded-lg`}>
          Ir a
        </button>
    </div>
    )
  }
)}
  </>
  );
};
  export default AccesToMySchools