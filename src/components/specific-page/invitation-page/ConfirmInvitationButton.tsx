import { apiRoutes } from "../../../constants/constants";
import toast from "../../common/toast/toast";

const ConfirmInvitationButton = ({ code } : { code: string }) => {
    
    const handleConfirmation = async () => {
        console.log("Clikc")
        const res = await fetch(apiRoutes.school.joinIntoSchool, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ code: code })
        })

        if(res.status !== 200){
            const { message } = await res.json();
            toast.error(message, {
                position: "tr"
            })
            return;
        }
        console.log(res.redirected)
        if(res.redirected){
            window.location.assign(res.url)
        }

        return;
    }
    
    return (
        <button onClick={handleConfirmation} className="bg-primary mt-8 hover:bg-teal-600 transition-colors duration-500 text-xl font-Ubuntu text-white w-full px-6 py-3 rounded-xl">
        Unirme
    </button>
    )
}
export default ConfirmInvitationButton;