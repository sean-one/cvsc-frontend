import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';


import useAuth from '../../../hooks/useAuth';
import { useRemoveUserRoleMutation } from '../../../hooks/useRolesApi';
import useNotification from '../../../hooks/useNotification';

const Styles = styled.div`
    .removeButton {
        color: ${(props) => props.children.props.variant};
        pointer-events: ${(props) => (props.children.props.type === 'disabled') ? 'none' : ''};
    }
`;


const RemoveUserRole = ({ role_id, role_type }) => {
    const { auth, logout_user, setAuth } = useAuth()
    const { mutateAsync: removeUserRole } = useRemoveUserRoleMutation()
    const { dispatch } = useNotification()
    

    const userRoleRemove = async (id) => {
        try {
            const removed_role = await removeUserRole(id)

            if(removed_role.status === 204) {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'SUCCESS',
                        message: 'role has been deleted'
                    }
                })

                setAuth({ user: auth.user, roles: auth.roles.filter(role => role !== role_id) })
                
            }


            
        } catch (error) {
            
            if(error?.response.status === 400) {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: `${error?.response.data.error.message}`
                    }
                })
            }

            if(error?.response.status === 401) {
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
            <FontAwesomeIcon
                icon={faTrash}
                className='removeButton'
                onClick={() => userRoleRemove(role_id)}
                variant={(role_type === process.env.REACT_APP_ADMIN_ACCOUNT) ? 'grey' : '#780000'}
                type={(role_type === process.env.REACT_APP_ADMIN_ACCOUNT) ? 'disabled' : 'enabled'}
            />
        </Styles>
    )
}

export default RemoveUserRole;