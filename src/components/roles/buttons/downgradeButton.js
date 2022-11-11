import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import { NotificationsContext } from '../../../context/notifications/notifications.provider';
import { useManagerDowngradeMutation } from '../../../hooks/useBusinessApi';


const DowngradeButton = ({ role_id }) => {
    const { dispatch } = useContext(NotificationsContext)
    const { mutateAsync: downgradeRoleMutation } = useManagerDowngradeMutation()

    let navigate = useNavigate()

    const downgradeRole = async (e) => {
        const downgrade_response = await downgradeRoleMutation(e.currentTarget.value)

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
        <Button size='sm' variant='outline-danger' onClick={(e) => downgradeRole(e)} value={role_id}>downgrade</Button>
    )
}

export default DowngradeButton;