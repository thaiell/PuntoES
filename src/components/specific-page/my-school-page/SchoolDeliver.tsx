import { useState } from "react"


const SchoolDeliver = () => {
    const [counter, setCounter] = useState<number>(0)
    

return (
<div>
    <h1>
    Deliver
    </h1>

    <h2>
        Podria cuando se completa el pedido
        tener un lñugar para crear reviews sobre la pagina y el servicio
        y compartir los links de las redes sociales
    </h2>

    <button onClick={() => setCounter(counter + 1)}>
                {counter}
            </button>
</div>
)
}
export default SchoolDeliver