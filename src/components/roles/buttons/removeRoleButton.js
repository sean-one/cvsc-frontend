import React, { useContext } from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import { NotificationsContext } from '../../../context/notifications/notifications.provider';
import { useManagerRoleDeleteMutation } from '../../../hooks/useBusinessApi';

const RemoveRoleButton = ({ role_id }) => {
    const { dispatch } = useContext(NotificationsContext)
    const { mutateAsync: roleDeleteMutation } = useManagerRoleDeleteMutation()

    const removeRole = async (e) => {
        const removed_role = await roleDeleteMutation(e.currentTarget.value)

        if (removed_role.status === 200) {
            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'SUCCESS',
                    message: 'role has been deleted'
                }
            })
        } else {
            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'ERROR',
                    message: 'error inside role remove'
                }
            })
        }
    }


    return (
        <Button size='sm' variant='dnager' onClick={(e) => removeRole(e)} value={role_id}>
            <FontAwesomeIcon icon={faTrash} />
        </Button>
    )
}

export default RemoveRoleButton;