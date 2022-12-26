import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import { useRemoveUserRoleMutation } from '../../../hooks/useRolesApi';
import useNotification from '../../../hooks/useNotification';

const RemoveUserRole = ({ role_id }) => {
    const { mutateAsync: removeUserRole } = useRemoveUserRoleMutation()
    const { dispatch } = useNotification()
    
    let navigate = useNavigate()

    const userRoleRemove = async (e) => {
        try {
            const removed_role = await removeUserRole(e.currentTarget.value)

            if(removed_role.status === 204) {
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
        <Button size='sm' variant='outline-danger' onClick={(e) => userRoleRemove(e)} value={role_id}>
            delete
        </Button>
    )
}

export default RemoveUserRole;