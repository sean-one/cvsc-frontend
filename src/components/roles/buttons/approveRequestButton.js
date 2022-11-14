import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

import { usePendingRoleMutation } from '../../../hooks/useBusinessApi';
import useNotification from '../../../hooks/useNotification';
import { role_types } from '../../../helpers/dataCleanUp';

const ApproveRequestButton = ({ role_id }) => {
    const { dispatch } = useNotification()
    const { mutateAsync: roleApprovalMutation } = usePendingRoleMutation()
    let navigate = useNavigate()


    const approveRequest = async (e) => {
        const approval_response = await roleApprovalMutation(e.currentTarget.value)

        if (approval_response.status === 200) {
            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'SUCCESS',
                    message: `${approval_response.data.username} now has ${role_types[approval_response.data.role_type]} privileges`
                }
            })
        } else if (approval_response.status === 401) {
            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'ERROR',
                    message: 'token authoriztion error, please sign in'
                }
            })
            navigate('/login')
        } else {
            console.log(approval_response)
        }
    }


    return (
        <Button size='sm' variant='success' onClick={(e) => approveRequest(e)} value={role_id}>
            <FontAwesomeIcon icon={faCheck} />
        </Button>
    )
}

export default ApproveRequestButton;