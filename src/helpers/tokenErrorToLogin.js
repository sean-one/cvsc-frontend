import { useNavigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";

export const tokenErrorToLogin = () => {
    const { setAuth } = useAuth()
    let navigate = useNavigate()

    // remove 'jwt' from local storage if present
    localStorage.removeItem('jwt');

    // reset auth
    setAuth({});

    // navigate to login
    navigate('/login')
}