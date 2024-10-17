import {useEffect, useState} from "react";
import {makeQuery} from "./api/api.js";

function App() {
    const [loading, setLoading] = useState(false)
    const [answer, setAnswer] = useState([])
    const [text, setText] = useState()

    const handleClick = () => {
        setLoading(true)
        makeQuery(text).then(data => {
            console.log(data)
            setAnswer((prevValue) => {
                return [...prevValue, data.choices[0].message.content]
            })
        })
        setLoading(false)
    }
    const handleChange = (e) => {
        setText(e.target.value)
    }
    return (
        <div className={'max-w-1000px'}>
            <h2>Генерация смешного диалога</h2>

            {loading ? <p>loading</p> : answer.map((answer) => {
                return <p>{answer}</p>
            })}

            <div className={"flex"}>
                <input onChange={handleChange} type="text"/>
                <button onClick={handleClick}>submit</button>
            </div>
        </div>
    );
}

export default App;
