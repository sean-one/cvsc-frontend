import React from 'react';
import { useNavigate } from 'react-router-dom';

import useAuth from '../../../hooks/useAuth';
import { useApproveRoleMutation } from '../../../hooks/useRolesApi';
import useNotification from '../../../hooks/useNotification';
import { role_types } from '../../../helpers/dataCleanUp';

import { ApproveUserIcon } from '../../icons/siteIcons';

const ApproveRole = ({ role_id }) => {
    const { logout_user } = useAuth()
    const { dispatch } = useNotification()
    const { mutateAsync: approveRole } = useApproveRoleMutation()
    let navigate = useNavigate()

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
            if (error?.response?.status === 400 || error?.response?.status === 401) {
                logout_user()
                navigate('/login');
                return null;
            } else {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: error?.response?.data?.error?.message
                    }
                })   
            }
        }
    }


    return (
        <button onClick={(e) => roleApprove(e)}><ApproveUserIcon /></button>
    )
}

export default ApproveRole;