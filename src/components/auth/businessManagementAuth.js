import { Navigate, Outlet, useParams } from "react-router";

import useAuth from "../../hooks/useAuth";


const BusinessManagementAuth = () => {
    const { auth } = useAuth()
    const { business_id } = useParams()

    // if no role is found - returns undefined
    const user_business_role = auth?.roles.find(role => role.business_id === business_id)


    return (
        ((user_business_role === undefined) || (user_business_role.role_type < process.env.REACT_APP_MANAGER_ACCOUNT))
            ? <Navigate to={`/business/${business_id}`} replace />
            : <Outlet />
    )
}

export default BusinessManagementAuth;