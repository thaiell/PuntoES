import { useState } from "react"
const SchoolDefault = () => {
    const [counter, setCounter] = useState<number>(0)
    return (
        <div>
            <h1>
                Default
            </h1>
            <button onClick={() => setCounter(counter + 1)}>
                {counter}
            </button>
        </div>
    )
}
export default SchoolDefault