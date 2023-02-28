import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

import useAuth from '../../../hooks/useAuth';
import { useApproveRoleMutation } from '../../../hooks/useRolesApi';
import useNotification from '../../../hooks/useNotification';
import { role_types } from '../../../helpers/dataCleanUp';

const Styles = styled.div`
    .roleApprove {
        color: #19381F;
    }
`;

const ApproveRole = ({ role_id }) => {
    const { logout_user } = useAuth()
    const { dispatch } = useNotification()
    const { mutateAsync: approveRole } = useApproveRoleMutation()

    const roleApprove = async () => {
        try {
            const approval_response = await approveRole(role_id)
    
            if (approval_response.status === 200) {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'SUCCESS',
                        message: `${approval_response.data.username} now has ${role_types[approval_response.data.role_type].type} privileges`
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
        <Styles>
            <FontAwesomeIcon className='roleApprove' icon={faCheck} onClick={(e) => roleApprove(e)} />
        </Styles>
    )
}

export default ApproveRole;