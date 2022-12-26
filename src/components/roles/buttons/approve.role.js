import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import { useRequestApprovalMutation } from '../../../hooks/useBusinessApi';
import useNotification from '../../../hooks/useNotification';
import { role_types } from '../../../helpers/dataCleanUp';

const ApproveRole = ({ role_id }) => {
    const { dispatch } = useNotification()
    const { mutateAsync: requestApprovalMutation } = useRequestApprovalMutation()
    let navigate = useNavigate()


    const approveRequest = async (e) => {
        try {
            const approval_response = await requestApprovalMutation(e.currentTarget.value)
    
            if (approval_response.status === 200) {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'SUCCESS',
                        message: `${approval_response.data.username} now has ${role_types[approval_response.data.role_type]} privileges`
                    }
                })
            }
            
        } catch (error) {
            if (error?.response.status === 400) {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: `${error?.response.data.error.message}`
                    }
                })
            }

            if (error?.response.status === 401) {
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
        <Button size='sm' variant='outline-success' onClick={(e) => approveRequest(e)} value={role_id}>
            approve
            {/* <FontAwesomeIcon icon={faCheck} /> */}
        </Button>
    )
}

export default ApproveRole;