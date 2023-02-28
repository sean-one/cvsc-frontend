import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faBong, faTimes } from '@fortawesome/free-solid-svg-icons';
// import { useNavigate } from 'react-router-dom';
// import { Button } from 'react-bootstrap';

import useAuth from '../../../hooks/useAuth';
import useNotification from '../../../hooks/useNotification';
import { useRemoveRoleMutation } from '../../../hooks/useRolesApi';

const RemoveRole = ({ role_id }) => {
    const { logout_user } = useAuth()
    const { dispatch } = useNotification()
    const { mutateAsync: removeRole } = useRemoveRoleMutation()

    // let navigate = useNavigate()

    const roleRemove = async () => {
        try {
            const removed_role = await removeRole(role_id)
    
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

                logout_user()
                // navigate('/login')
            }
            
        }
    }


    return (
        <FontAwesomeIcon icon={faTimes} onClick={(e) => roleRemove(e)} />
        // <Button size='sm' variant='outline-danger' onClick={(e) => roleRemove(e)} value={role_id}>
        //     delete
        // </Button>
    )
}

export default RemoveRole;