import React from 'react';
import { useNavigate } from 'react-router-dom';

import useAuth from '../../../hooks/useAuth';
import { useRemoveUserRoleMutation } from '../../../hooks/useRolesApi';
import useNotification from '../../../hooks/useNotification';

import { DeleteIcon } from '../../icons/siteIcons';

const RemoveUserRole = ({ role }) => {
    const { auth, setAuth, logout_user } = useAuth()
    const { mutateAsync: removeUserRole } = useRemoveUserRoleMutation()
    const { dispatch } = useNotification()
    let navigate = useNavigate()

    const userRoleRemove = async(role_id) => {
        try {
            const removedRole = await removeUserRole(role_id)

            if(removedRole.status === 200) {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'SUCCESS',
                        message: 'role has been delete'
                    }
                })

                setAuth({ user: auth.user, roles: auth.roles.filter(role => role.id !== role_id)})
            }
        } catch (error) {
            // returns 400 or 401 if user needs to login
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
        <div className='deleteButton' disabled={role.role_type === process.env.REACT_APP_ADMIN_ACCOUNT} onClick={() => userRoleRemove(role.id)}>
            <DeleteIcon />
        </div>
    )
}

export default RemoveUserRole;