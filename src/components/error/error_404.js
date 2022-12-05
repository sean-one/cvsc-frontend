import { useNavigate } from "react-router-dom"

export const ErrorPage = () => {
    let navigate = useNavigate()


    return (
        <div>
            <h1>404 Not Found</h1>
            <p>unable to find that page</p>
            <button onClick={() => navigate('/')}>home</button>
        </div>
    )
}