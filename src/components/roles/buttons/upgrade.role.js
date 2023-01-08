import React from 'react';
// import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import useAuth from '../../../hooks/useAuth';
import useNotification from '../../../hooks/useNotification';
import { useUpgradeRoleMutation } from '../../../hooks/useRolesApi';
import { role_types } from '../../../helpers/dataCleanUp';


const UpgradeRole = ({ role_id }) => {
    const { logout_user } = useAuth()
    const { dispatch } = useNotification()
    const { mutateAsync: upgradeRole } = useUpgradeRoleMutation()

    // let navigate = useNavigate()

    const roleUpgrade = async (e) => {
        try {
            const upgrade_response = await upgradeRole(e.currentTarget.value)
            
            if (upgrade_response.status === 200) {
    
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'SUCCESS',
                        message: `${upgrade_response.data.username} now has ${role_types[upgrade_response.data.role_type]} privileges`
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
                // navigate('/login')
            }
            
        }

    }


    return (
        <Button size='sm' variant='outline-success' onClick={(e) => roleUpgrade(e)} value={role_id}>upgrade</Button>
    )
}

export default UpgradeRole;