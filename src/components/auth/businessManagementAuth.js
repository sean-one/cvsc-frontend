import React from 'react';
import { useParams } from "react-router";
import { useUserBusinessRole } from "../../hooks/useRolesApi";


const BusinessManagementAuth = ({ children }) => {
    const { business_id } = useParams()
    const { data: user_role, status: role_status, error } = useUserBusinessRole(business_id)

    if (role_status === 'loading') {
        return <div>loading...</div>
    }

    if (role_status === 'error') {
        console.log(error)
    }

    // if no role is found - returns undefined
    const user_business_role = user_role.data
    
    const childWithProps = React.cloneElement(children, { userBusinessRole: user_business_role })

    return (
        <div>
            {user_business_role ? childWithProps : <div>No access</div>}
        </div>
    )
}

export default BusinessManagementAuth;