import { useLocation, Navigate, Outlet } from "react-router";

import useAuth from "../../hooks/useAuth";

const AuthRoute = () => {
    const { auth } = useAuth()
    const location = useLocation()

    console.log('inside the auth route')
    console.log(auth)
    return (
        // <Outlet />
        (Object.keys(auth).length > 0)
            ? <Outlet />
            : <Navigate to="/login" state={{ from: location }} replace />
    )
}

export default AuthRoute;