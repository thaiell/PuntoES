import { useEffect, useState } from "react"
import SchoolDefault from "./SchoolDefault";
import SchoolPayAndNoti from "./SchoolPayAndNoti";
import SchoolDeliver from "./SchoolDeliver";
import SchoolConfig from "./SchoolConfig";
import SchoolForm from "./SchoolForm";
import type { SchoolAPIResponse } from "../../../types/school";


const searchParamName = "busq" /* Nombre de el parametro de busqueda */

const MainRenderer = ({ 
    steps,
    schoolId
}: {
    steps: SchoolAPIResponse["steps"], 
    schoolId: number
}) => {


const [actualRender, setActualRender] = useState<"form" | "payment" | "deliver" | "config" | "default">("default"); /* Posibles estados -> default */

useEffect(() => { /* Set a listener to read the changes in the URL search params */
    updateRender();
    window.addEventListener('popstate', updateRender);
    return () => {
        window.removeEventListener('popstate', updateRender);
    };
}, []);


const updateRender = () => { /* Function that read the changes in the URL search params */
    const params = new URLSearchParams(window.location.search);
    const view = params.get(searchParamName);
    switch(view){
        case "form":
            setActualRender("form");
            break;
        case "payment":
            setActualRender("payment");
            break;
        case "deliver":
            setActualRender("deliver");
            break;
        case "config":
            setActualRender("config");
            break;
        default:
            setActualRender("default");
            break;
    }
};
    return (
        <>
            {actualRender === "default" && <SchoolDefault /> }
            
            {actualRender === "form" && <SchoolForm form={steps.formStep.value} schoolId={schoolId} /> }
            {actualRender === "payment" && <SchoolPayAndNoti /> }
            {actualRender === "deliver" && <SchoolDeliver /> }
            {actualRender === "config" && <SchoolConfig /> }
        </>
    )
}
export default MainRenderer