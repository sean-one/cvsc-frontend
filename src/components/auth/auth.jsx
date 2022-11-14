import { useLocation, Navigate, Outlet } from "react-router";

import useAuth from "../../hooks/useAuth";

const AuthRoute = () => {
    const { auth } = useAuth()
    const location = useLocation()


    return (
        (Object.keys(auth).length > 0)
            ? <Outlet />
            : auth?.id
                ? <Navigate to="/invalid" state={{ from: location }} replace />
                : <Navigate to="/login" state={{ from: location }} replace />
    )
}

export default AuthRoute;