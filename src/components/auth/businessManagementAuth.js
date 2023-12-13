import React from 'react';
import { useParams } from "react-router";

import { useManagementRole } from "../../hooks/useRolesApi";

const BusinessManagementAuth = ({ children }) => {
    const { business_id } = useParams()
    const { data: user_role, status: role_status } = useManagementRole(business_id)

    if (role_status === 'loading') {
        return (
            <div>loading...</div>
            )
    }

    const user_business_role = user_role?.data
    const childWithProps = React.cloneElement(children, { userBusinessRole: user_business_role })


    return (
        <div>
            {user_business_role ? childWithProps : <div>No access</div>}
        </div>
    )
}

export default BusinessManagementAuth;