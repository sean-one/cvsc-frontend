import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import useNotification from '../../../hooks/useNotification';
import { useUpgradeRoleMutation } from '../../../hooks/useRolesApi';
import { role_types } from '../../../helpers/dataCleanUp';


const UpgradeRole = ({ role_id }) => {
    const { dispatch } = useNotification()
    const { mutateAsync: upgradeRole } = useUpgradeRoleMutation()

    let navigate = useNavigate()

    const roleUpgrade = async (e) => {
        const upgrade_response = await upgradeRole(e.currentTarget.value)

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

            navigate('/login')
        }
    }


    return (
        <Button size='sm' variant='outline-success' onClick={(e) => roleUpgrade(e)} value={role_id}>upgrade</Button>
    )
}

export default UpgradeRole;