import React from 'react';
import { Accordion } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';

import useAuth from '../../../hooks/useAuth';
import useNotification from '../../../hooks/useNotification';
import { usePendingBusinessRolesQuery } from '../../../hooks/useRolesApi';
import LoadingSpinner from '../../loadingSpinner';
import ApproveRole from '../../roles/buttons/approve.role';
import RemoveRole from '../../roles/buttons/remove.role';

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
        <>
            <Accordion flush>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Pending Role Request</Accordion.Header>
                    <Accordion.Body className='p-1'>
                        {
                            pending_roles.data.map(role => (
                                <div key={role.id} className='d-flex justify-content-between align-items-center ps-2 mb-1'>
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
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
            {/* {
                (pending_roles.data.length > 0) &&
                    <div className='bg-light rounded p-1 my-2'>
                        <h6>Pending Business Request</h6>
                        {
                            pending_roles.data.map(role => (
                                <div key={role.id} className='d-flex justify-content-between align-items-center ps-2 mb-1'>
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
            } */}
        </>
    )
}

export default PendingRoleRequest;