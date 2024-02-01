import { useLocation, Navigate, Outlet } from "react-router";

import useAuth from "../../hooks/useAuth";

const AuthRoute = () => {
    const { isLoggedIn } = useAuth()
    const { pathname } = useLocation()

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    
    return (
        (isLoggedIn && getCookie('jwt'))
            ? <Outlet />
            : <Navigate to="/login" state={{ from: pathname }} replace />
    )
}

export default AuthRoute;