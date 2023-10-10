import React from 'react';
import { useNavigate } from 'react-router-dom';

import useAuth from '../../../hooks/useAuth';
import useNotification from '../../../hooks/useNotification';
import { useRemoveRoleMutation } from '../../../hooks/useRolesApi';
import { DeleteIcon } from '../../icons/siteIcons';


const RemoveRole = ({ role_id }) => {
    const { logout_user } = useAuth()
    const { dispatch } = useNotification()
    const { mutateAsync: removeRole } = useRemoveRoleMutation()
    let navigate = useNavigate()

    const roleRemove = async () => {
        try {
            const removed_role = await removeRole(role_id)
    
            if (removed_role.status === 200) {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'SUCCESS',
                        message: 'role has been deleted'
                    }
                })
            }
            
        } catch (error) {
            if(error?.response?.status === 400 || error?.response?.status === 401) {
                logout_user();
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
        <button className='deleteButton' onClick={(e) => roleRemove(e)}><DeleteIcon /></button>
    )
}

export default RemoveRole;