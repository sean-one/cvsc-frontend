import { useEffect } from 'react';
import { useLocation, Navigate, Outlet } from "react-router";

import useNotification from "../../hooks/useNotification";
import useAuth from "../../hooks/useAuth";


const AuthRoute = () => {
    const { isLoggedIn } = useAuth();
    const { dispatch } = useNotification();
    const { pathname } = useLocation();

    // check for token, return token or null if no token is present
    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    useEffect(() => {
        if (!isLoggedIn) {
            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'ERROR',
                    message: 'must be logged in yo!'
                }
            })
        }
    }, [dispatch, isLoggedIn])
    
    return (
        (isLoggedIn && getCookie('jwt'))
            ? <Outlet />
            : <Navigate to="/login" state={{ from: pathname }} replace />
    )
}

export default AuthRoute;