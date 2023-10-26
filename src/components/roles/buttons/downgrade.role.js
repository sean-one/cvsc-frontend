import React from 'react';
import { useNavigate } from 'react-router-dom';

import useAuth from '../../../hooks/useAuth';
import useNotification from '../../../hooks/useNotification';
import { useRoleAction } from '../../../hooks/useRolesApi';


const DowngradeRole = ({ role_id }) => {
    const { logout_user } = useAuth()
    const { dispatch } = useNotification()
    const { mutateAsync: roleDowngradeAction } = useRoleAction()
    let navigate = useNavigate()

    const roleDowngrade = async () => {
        try {
            const downgrade_response = await roleDowngradeAction({ role_id: role_id, action_type: 'downgrade' })
    
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
            if(error?.response?.status === 400 || error?.response?.status === 401) {
                logout_user()
                navigate('/login')
                return null;
            } else {
                
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: error?.response?.data?.error?.message
                    }
                })
            }
        }
    }

    return (
        <button onClick={(e) => roleDowngrade(e)}>Downgrade</button>
    )
}

export default DowngradeRole;