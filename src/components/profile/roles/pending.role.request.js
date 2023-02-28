import React from 'react';
// import { Accordion } from 'react-bootstrap';
import styled from 'styled-components';
// import { useNavigate } from 'react-router-dom';

import useAuth from '../../../hooks/useAuth';
import useNotification from '../../../hooks/useNotification';
import { usePendingBusinessRolesQuery } from '../../../hooks/useRolesApi';
import LoadingSpinner from '../../loadingSpinner';
import ApproveRole from '../../roles/buttons/approve.role';
import RemoveRole from '../../roles/buttons/remove.role';

const Styles = styled.div`
    .pendingRoles {
        padding-bottom: 1.5rem;
    }

    .pendingRolesHeader {
        display: flex;
        margin-bottom: 0.5rem;
        justify-content: space-between;
        align-content: center;
        border-bottom: 1px solid black;
    }

    .pendingRole {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left: 0.5rem;
        margin-bottom: 0.25rem;
    }
`;

const PendingRoleRequest = ({ user_id }) => {
    const { logout_user } = useAuth()
    const { dispatch } = useNotification()
    const { data: pending_roles, isLoading, error, isError } = usePendingBusinessRolesQuery(user_id)
    // let navigate = useNavigate()


    if (isLoading) {
        return <LoadingSpinner />
    }

    if(isError) {
        if(error?.response.status === 401) {
            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'SUCCESS',
                    message: `${error.response.data.error.message}`
                }
            })

            logout_user()
            // navigate('/login')
        }
    }


    return (
        <Styles>
            <div className='pendingRoles'>
                <div className='pendingRolesHeader'>
                    <div>Pending Roles</div>
                </div>
                <div>
                    {
                        pending_roles.data.map(role => (
                            <div key={role.id} className='pendingRole'>
                                <div className='flex-fill'>{role.business_name}</div>
                                <div className='flex-fill text-end'>{role.username}</div>
                                <div className='d-flex ps-2 text-end'>
                                    <div className='mx-1'>
                                        <ApproveRole role_id={role.id} />
                                    </div>
                                    <div className='mx-1'>
                                        <RemoveRole role_id={role.id} />
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </Styles>
    )
}

export default PendingRoleRequest;