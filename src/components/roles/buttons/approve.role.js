import React from 'react';
// import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import useAuth from '../../../hooks/useAuth';
import { useApproveRoleMutation } from '../../../hooks/useRolesApi';
import useNotification from '../../../hooks/useNotification';
import { role_types } from '../../../helpers/dataCleanUp';

const ApproveRole = ({ role_id }) => {
    const { logout_user } = useAuth()
    const { dispatch } = useNotification()
    const { mutateAsync: approveRole } = useApproveRoleMutation()
    // let navigate = useNavigate()


    const roleApprove = async (e) => {
        try {
            const approval_response = await approveRole(e.currentTarget.value)
    
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
                
                logout_user()
                // navigate('/login')
            }
            
        }
    }


    return (
        <Button size='sm' variant='outline-success' onClick={(e) => roleApprove(e)} value={role_id}>
            approve
            {/* <FontAwesomeIcon icon={faCheck} /> */}
        </Button>
    )
}

export default ApproveRole;