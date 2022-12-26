import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import useNotification from '../../../hooks/useNotification';
import { useDowngradeRoleMutation } from '../../../hooks/useRolesApi';


const DowngradeRole = ({ role_id }) => {
    const { dispatch } = useNotification()
    const { mutateAsync: downgradeRole } = useDowngradeRoleMutation()

    let navigate = useNavigate()

    const roleDowngrade = async (e) => {
        const downgrade_response = await downgradeRole(e.currentTarget.value)

        if (downgrade_response.status === 200) {

            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'SUCCESS',
                    message: `${downgrade_response.data.username} has been downgraded to creator privileges`
                }
            })
        } else {

            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'ERROR',
                    message: 'something is not right'
                }
            })

            navigate('/login')
        }
    }

    return (
        <Button size='sm' variant='outline-danger' onClick={(e) => roleDowngrade(e)} value={role_id}>downgrade</Button>
    )
}

export default DowngradeRole;