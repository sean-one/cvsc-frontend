import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import { NotificationsContext } from '../../../context/notifications/notifications.provider';
import { useCreatorUpgradeMutation } from '../../../hooks/useBusinessApi';
import { role_types } from '../../../helpers/dataCleanUp';


const UpgradeButton = ({ role_id }) => {
    const { dispatch } = useContext(NotificationsContext)
    const { mutateAsync: upgradeRoleMutation } = useCreatorUpgradeMutation()

    let history = useHistory()

    const upgradeRole = async (e) => {
        const upgrade_response = await upgradeRoleMutation(e.currentTarget.value)

        if (upgrade_response.status === 200) {
            
            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'SUCCESS',
                    message: `${upgrade_response.data.username} now has ${role_types[upgrade_response.data.role_type]} privileges`
                }
            })
        } else {
            
            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'ERROR',
                    message: 'token authorization error, please sign in'
                }
            })

            history.push('/login')
        }
    }

    
    return (
        <Button size='sm' variant='outline-success' onClick={(e) => upgradeRole(e)} value={role_id}>upgrade</Button>
    )
}

export default UpgradeButton;