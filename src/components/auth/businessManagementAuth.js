import React from 'react';
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import { useUserBusinessRole } from "../../hooks/useRolesApi";
// import useAuth from "../../hooks/useAuth";


const BusinessManagementAuth = ({ children }) => {
    // const { auth } = useAuth()
    const { business_id } = useParams()
    const { data: user_role, status: role_status, error } = useUserBusinessRole(business_id)

    let navigate = useNavigate()

    if (role_status === 'loading') {
        return <div>loading...</div>
    }

    if (role_status === 'error') {
        console.log(error)

        navigate('/login')
    }

    // if no role is found - returns undefined
    const user_business_role = user_role.data
    // const user_business_role = auth?.roles.find(role => role.active_role && role.business_id === business_id)
    const childWithProps = React.cloneElement(children, { userBusinessRole: user_business_role })

    console.log('BUSINESSMANAGEMENTAUTH')
    return (
        <div>
            {user_business_role ? childWithProps : <div>No access</div>}
        </div>
        // ((user_business_role === undefined) || (user_business_role.role_type < process.env.REACT_APP_MANAGER_ACCOUNT))
        //     ? <Navigate to={`/business/${business_id}`} replace />
        //     : <Outlet />
    )
}

export default BusinessManagementAuth;