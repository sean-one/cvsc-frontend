import React from 'react';
import styled from 'styled-components';

import useAuth from '../../../hooks/useAuth';
import { useRemoveUserRoleMutation } from '../../../hooks/useRolesApi';
import useNotification from '../../../hooks/useNotification';

const RemoveUserRoleStyles = styled.div``;

const RemoveUserRole = ({ role }) => {
    const { auth, setAuth } = useAuth()
    const { mutateAsync: removeUserRole } = useRemoveUserRoleMutation()
    const { dispatch } = useNotification()
    
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
            console.log(error)
        }
    }

    return (
        <RemoveUserRoleStyles>
            <button disabled={role.role_type === process.env.REACT_APP_ADMIN_ACCOUNT} onClick={() => userRoleRemove(role.id)}>delete</button>
        </RemoveUserRoleStyles>
    )
}

export default RemoveUserRole;