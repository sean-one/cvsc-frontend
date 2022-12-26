import React from 'react';
import { Button } from 'react-bootstrap';

import useNotification from '../../../hooks/useNotification';
import { useRemoveRoleMutation } from '../../../hooks/useRolesApi';

const RemoveRole = ({ role_id }) => {
    const { dispatch } = useNotification()
    const { mutateAsync: removeRole } = useRemoveRoleMutation()

    const roleRemove = async (e) => {
        const removed_role = await removeRole(e.currentTarget.value)

        if (removed_role.status === 204) {
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
        <Button size='sm' variant='outline-danger' onClick={(e) => roleRemove(e)} value={role_id}>
            delete
        </Button>
    )
}

export default RemoveRole;