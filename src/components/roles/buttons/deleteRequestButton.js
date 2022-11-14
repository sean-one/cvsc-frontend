import React from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import useNotification from '../../../hooks/useNotification';
import { useUserRoleDeleteMutation } from '../../../hooks/useBusinessApi';


const DeleteRequestButton = ({ role_id }) => {
    const { dispatch } = useNotification()
    const { mutateAsync: requestDeleteMutation } = useUserRoleDeleteMutation()

    const removeRequest = async (e) => {
        const remove_response = await requestDeleteMutation(e.currentTarget.value)

        if (remove_response.status === 200) {
            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'SUCCESS',
                    message: 'request has been rejected'
                }
            })
        } else {
            console.log('something went wrong')
        }
    }

    return (
        <Button size='sm' variant='danger' onClick={(e) => removeRequest(e)} value={role_id}>
            <FontAwesomeIcon icon={faTrash} />
        </Button>
    )
}

export default DeleteRequestButton;