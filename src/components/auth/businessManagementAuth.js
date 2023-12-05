import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router";

import useNotification from '../../hooks/useNotification';
import { useUserBusinessRole } from "../../hooks/useRolesApi";

const BusinessManagementAuth = ({ children }) => {
    const [ isLoadingUser, setIsLoadingUser ] = useState(true)
    const { business_id } = useParams()
    const { dispatch } = useNotification()
    const { data: user_role, status: role_status } = useUserBusinessRole(business_id)

    let navigate = useNavigate()
    
    // if no role is found - returns undefined
    const user_business_role = user_role?.data
    
    useEffect(() => {
        if (user_business_role?.role_type === process.env.REACT_APP_CREATOR_ACCOUNT || user_business_role === undefined) {
            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'ERROR',
                    message: 'invalid business role permissions'
                }
            });

            navigate('/');
        }
    }, [user_business_role, dispatch, navigate]);
    
    if (role_status === 'loading') {
        return <div>loading...</div>
    }


    const childWithProps = React.cloneElement(children, { userBusinessRole: user_business_role })

    return (
        <div>
            {user_business_role ? childWithProps : <div>No access</div>}
        </div>
    )
}

export default BusinessManagementAuth;