import React from 'react';
import { useNavigate } from 'react-router-dom';


import useAuth from '../../../hooks/useAuth';
import useNotification from '../../../hooks/useNotification';
import { useRoleAction } from '../../../hooks/useRolesApi';
import { role_types } from '../../../helpers/dataCleanUp';


const UpgradeRole = ({ role_id }) => {
    const { logout_user } = useAuth()
    const { dispatch } = useNotification()
    const { mutateAsync: roleUpgradeAction } = useRoleAction()
    let navigate = useNavigate()
    
    const roleUpgrade = async () => {
        try {
            const upgrade_response = await roleUpgradeAction({ role_id: role_id, action_type: 'upgrade' })
            
            if (upgrade_response.status === 200) {
    
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'SUCCESS',
                        message: `${upgrade_response.data.username} now has ${role_types[upgrade_response.data.role_type].type} privileges`
                    }
                })
            }

        } catch (error) {
            
            if(error?.response?.status === 400 || error?.response?.status === 401) {
                logout_user();
                navigate('/login');
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
        <button onClick={(e) => roleUpgrade(e)}>Upgrade</button>
    )
}

export default UpgradeRole;