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
        padding-bottom: 1rem;
        /* border: 2px solid blue; */
    }

    .pendingRolesHeader {
        display: flex;
        /* margin-bottom: 0.5rem; */
        justify-content: space-between;
        align-content: center;
        border-bottom: 1px solid black;
    }

    .pendingRole {
        display: flex;
        justify-content: space-between;
        align-items: end;
        padding: 0.25rem 0.5rem;
        border-bottom: 1px solid black;
        /* padding-left: 0.5rem; */
        /* margin-bottom: 0.25rem; */
    }

    .roleButtons {
        display: flex;
        gap: 10px;
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
                                <div className='border border-danger w-75'>{role.username}</div>
                                <div className='border border-success w-100'>{role.business_name}</div>
                                <div className='roleButtons'>
                                    <ApproveRole role_id={role.id} />
                                    <RemoveRole role_id={role.id} />
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