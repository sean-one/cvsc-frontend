import React from 'react';

import useAuth from '../../../hooks/useAuth';
import useNotification from '../../../hooks/useNotification';
import { useDowngradeRoleMutation } from '../../../hooks/useRolesApi';


const DowngradeRole = ({ role_id }) => {
    const { logout_user } = useAuth()
    const { dispatch } = useNotification()
    const { mutateAsync: downgradeRole } = useDowngradeRoleMutation()

    const roleDowngrade = async (e) => {
        try {
            const downgrade_response = await downgradeRole(e.currentTarget.value)
    
            if (downgrade_response.status === 200) {
    
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'SUCCESS',
                        message: `${downgrade_response.data.username} has been downgraded to creator privileges`
                    }
                })
            }
            
        } catch (error) {
            
            if(error?.response.status === 400) {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: `${error?.response.data.error.message}`
                    }
                })
            }
            
            if(error?.response.status === 401) {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: `${error?.response.data.error.message}`
                    }
                })

                logout_user()
            }
        }
    }

    return (
        <button onClick={(e) => roleDowngrade(e)} value={role_id}>Downgrade</button>
    )
}

export default DowngradeRole;