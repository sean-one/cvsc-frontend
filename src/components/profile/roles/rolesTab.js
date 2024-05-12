import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import useAuth from '../../../hooks/useAuth';
import useNotification from '../../../hooks/useNotification';
import { useUserRolesQuery } from '../../../hooks/useRolesApi';
import RoleRequest from '../../forms/role.request';
import UserRoles from './user.roles';
import LoadingSpinner from '../../loadingSpinner';

const RolesTabStyles = styled.div`
    .rolesTabWrapper {
        width: 100%;
        display: flex;
        flex-direction: column;

        @media (min-width: 1080px) {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            gap: 1rem;
        }

    }

    .requestSection {
        width: 100%;

        @media (min-width: 1080px) {
            flex-grow: 1;
        }
    }

    .userRolesListSection {
        width: 100%;

        @media (min-width: 1080px) {
            flex-grow: 1.7;
        }
    }

    .rolesTabNonValidated {
        padding: 2rem 1rem;
        height: 13rem;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
    }
`;


const RolesTab = () => {
    const { auth, user_reset } = useAuth();
    const { dispatch } = useNotification();
    const { data: user_roles, isPending, isError, error: user_roles_error } = useUserRolesQuery(auth?.user?.id)
    
    let navigate = useNavigate();

    useEffect(() => {
        if (isError) {
            if (user_roles_error?.response?.status === 401 || user_roles_error?.response?.data?.error?.type === 'token') {
                // remove expired or bad token and reset user
                user_reset()

                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: user_roles_error?.response?.data?.error?.message
                    }
                })

                navigate('/login')
            } else {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: user_roles_error?.response?.data?.error?.message
                    }
                })
    
                navigate('/profile')

            }
        }

    }, [dispatch, navigate, isError, user_roles_error, user_reset])
    

    return (
        <RolesTabStyles>
            {
                isPending ? (
                    <LoadingSpinner />
                ) : isError ? (
                    null
                ) : (
                    <div>
                        {
                            auth?.user?.email_verified
                                ? <div className='rolesTabWrapper'>
                                    <div className='requestSection'>
                                        <RoleRequest user_roles={user_roles?.data} />
                                    </div>
                                    
                                    {/* current user roles */}
                                    {
                                        (user_roles?.data?.length > 0) &&
                                            <div className='userRolesListSection'>
                                                <UserRoles roles={user_roles?.data} />
                                            </div>
                                    }
                                </div>
                                : <div className='rolesTabNonValidated'>
                                    <div>Email must be validated</div>
                                        <div>Please validate your email on <span style={{ color: 'var(--main-highlight-color)', cursor: 'pointer' }} onClick={() => navigate('/profile')}>account</span> page</div>
                                </div>

                        }
                    </div>
                )
            }
        </RolesTabStyles>
    )
}

export default RolesTab;