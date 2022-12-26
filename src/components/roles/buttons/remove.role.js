import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import useNotification from '../../../hooks/useNotification';
import { useRemoveRoleMutation } from '../../../hooks/useRolesApi';

const RemoveRole = ({ role_id }) => {
    const { dispatch } = useNotification()
    const { mutateAsync: removeRole } = useRemoveRoleMutation()

    let navigate = useNavigate()

    const roleRemove = async (e) => {
        try {
            const removed_role = await removeRole(e.currentTarget.value)
    
            if (removed_role.status === 204) {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'SUCCESS',
                        message: 'role has been deleted'
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

                navigate('/login')
            }
            
        }
    }


    return (
        <Button size='sm' variant='outline-danger' onClick={(e) => roleRemove(e)} value={role_id}>
            delete
        </Button>
    )
}

export default RemoveRole;