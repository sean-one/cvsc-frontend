import React from 'react';
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router";

// import useNotification from '../../hooks/useNotification';
import { useUserBusinessRole } from "../../hooks/useRolesApi";

const BusinessManagementAuth = ({ children }) => {
    // const [ isLoadingUser, setIsLoadingUser ] = useState(true)
    const { business_id } = useParams()
    // const { dispatch } = useNotification()
    const { data: user_role, status: role_status, error } = useUserBusinessRole(business_id)

    // let navigate = useNavigate()
    
    if (role_status === 'loading') {
        return (
            <div>loading...</div>
            )
    }

    if (role_status === 'error') {
        // 401 token missing or expired
        // 404 no role found - forward to profile view
        console.log(error)
        console.log(error.response)
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