import React from 'react';

import useAuth from '../../../hooks/useAuth';
import useNotification from '../../../hooks/useNotification';
import { useRoleDelete } from '../../../hooks/useRolesApi';
import { DeleteIcon } from '../../icons/siteIcons';


const DeleteRole = ({ role }) => {
    const { auth, setAuth } = useAuth();
    const { dispatch } = useNotification();
    const { mutateAsync: deleteRole } = useRoleDelete();

    const sendRoleDelete = async (role_id) => {
        try {
            const deleteRoleResponse = await deleteRole(role_id)

            if (deleteRoleResponse?.status === 200) {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'SUCCESS',
                        message: 'role has been deleted successfully'
                    }
                });

                setAuth({ user: auth.user, roles: auth.roles.filter(role => role.id !== role_id) })
            }
        } catch (error) {
            console.log(error)
            return
        }
    }

    return (
        <div className='deleteButton' onClick={() => sendRoleDelete(role.id)}>
            <DeleteIcon />
        </div>
    )
}

export default DeleteRole;