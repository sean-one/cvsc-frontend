import { useEffect } from 'react';
// import { Outlet } from "react-router";
import { useLocation, Navigate, Outlet } from "react-router";
// import AxiosInstance from '../../helpers/axios';

import useAuth from "../../hooks/useAuth";
// import { useUserQuery } from '../../hooks/useUserApi';
import useNotification from "../../hooks/useNotification";

const AuthRoute = () => {
    const { isLoggedIn, setAuth } = useAuth()
    const { dispatch } = useNotification();
    // const { data: user_data } = useUserQuery()
    const { pathname } = useLocation()

    // check for token, return token or null if no token is present
    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    // const jwt = getCookie('jwt')
    
    // console.log(user_data)
    return (
        // <Outlet />
        (isLoggedIn && getCookie('jwt'))
            ? <Outlet />
            : <Navigate to="/login" state={{ from: pathname }} replace />
    )
}

export default AuthRoute;