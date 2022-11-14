import { useLocation, Navigate, Outlet } from "react-router";

import useAuth from "../../hooks/useAuth";

const AuthRoute = () => {
    const { auth } = useAuth()
    const location = useLocation()

    console.log(auth)

    return (
        (Object.keys(auth).length > 0)
            ? <Outlet />
            : <Navigate to="/login" state={{ from: location }} replace />
    )
}

export default AuthRoute;