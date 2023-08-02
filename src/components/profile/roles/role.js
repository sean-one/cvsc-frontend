import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import useAuth from '../../../hooks/useAuth';
import { useRemoveUserRoleMutation } from '../../../hooks/useRolesApi';
import useNotification from '../../../hooks/useNotification';


const RoleStyles = styled.div`
    .roleWrapper {
        margin: 0.5rem 0;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .roleButtonWrapper {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        gap: 10px;
    }
`;

const Role = ({ role }) => {
    const { auth, setAuth } = useAuth()
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
            console.log(error)
        }
    }


    return (
        <RoleStyles>
            <div className='roleWrapper'>
                <div>{role.business_name}</div>
                <div className='roleButtonWrapper'>
                    <button disabled={!role.active_role} onClick={() => navigate('/event/create', { state: role.business_id })}>create</button>
                    <button disabled={role.role_type === process.env.REACT_APP_ADMIN_ACCOUNT} onClick={() => userRoleRemove(role.id)}>delete</button>
                </div>
            </div>
        </RoleStyles>
    )
}

export default Role;