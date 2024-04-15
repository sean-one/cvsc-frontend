import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getImageSrc } from '../../../helpers/getImageSrc';

import useAuth from '../../../hooks/useAuth';
import useNotification from '../../../hooks/useNotification';
import UserEditForm from '../../forms/user.edit.form';
import { UserEditIcon } from '../../icons/siteIcons';
import { useUserAccountRole } from '../../../hooks/useRolesApi';
import LoadingSpinner from '../../loadingSpinner';

const UserAccountStyles = styled.div`
    .userAccountPage {
        display: flex;
        border: 0.1rem solid var(--main-color);
        flex-direction: column;
        align-items: center;
        margin: 0 0.375rem;
        padding: 2.25rem 0.75rem 0.75rem;
        border-radius: 5px;
    }

    .profileImage {
        position: relative;
        min-width: 22.5rem;
        max-width: var(--max-circle-image);

        canvas {
            max-width: 100%;
            border: 0.1rem solid var(--main-color);
            display: block;
            border-radius: 50%;
        }
        
        img {
            width: 100%;
            border: 0.1rem solid var(--main-color);
            display: block;
            border-radius: 50%;
        }
    }
    
    .userEditButton {
        padding: 1rem;
        position: absolute;
        right: 10%;
        bottom: 0;
        border: 0.1rem solid var(--main-color);
        border-radius: 50%;
        color: var(--main-highlight-color);
        background-color: var(--main-background-color);
    }

    .accountDetails {
        display: flex;
        flex-direction: column;
        width: 100%;
        align-self: start;
        padding: 1.5rem 0 0.75rem;
        gap: 0.5rem;
    }
    
    .profileHeader {
        color: var(--main-highlight-color);
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin: 0.5rem 0;
    }
    
    .usernameHeader {
        font-weight: bold;
        font-size: 2.25rem;
        align-self: flex-end;
    }
    
    .accountTypeHeader {
        align-self: flex-end;
    }

    .userDetails {
        color: var(--main-color);
        height: 100%;
    }

    .updateWrapper {
        display: flex;
        justify-content: space-between;
        align-content: center;
    }
`

const UserAccount = () => {
    const { auth, user_reset } = useAuth();
    const { dispatch } = useNotification();
    const [ editView, setEditView ] = useState(false)
    const { data: user_account_role, isPending, isError, error: user_account_role_error } = useUserAccountRole(auth?.user?.id)

    let navigate = useNavigate();

    useEffect(() => {
        if (isError) {
            if (user_account_role_error?.response?.status === 401 || user_account_role_error?.response?.data?.error?.type === 'token') {
                // remove expired or bad token and reset auth
                user_reset()

                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: user_account_role_error?.response?.data?.error?.message
                    }
                })

                return navigate('/login')
            } else {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: user_account_role_error?.response?.data?.error?.message
                    }
                })
            }
        }
    }, [dispatch, isError, navigate, user_account_role_error, user_reset])


    return (
        <UserAccountStyles>
            {
                !editView
                    ? <div className='userAccountPage'>
                        
                        <div className='profileImage'>
                            <img
                                src={getImageSrc(auth?.user?.avatar)}
                                alt={`user avatar`}
                            />
                            {
                                (!editView) &&
                                    <div className='userEditButton' onClick={() => setEditView(true)}><UserEditIcon /></div>
                            }
                        </div>
                        
                        <div className='accountDetails'>

                            <div className='profileHeader'>
                                <div className='usernameHeader'>{auth?.user.username}</div>
                                {
                                    isPending ? (
                                        <LoadingSpinner />
                                    ) : (
                                        <div className='accountTypeHeader'>{user_account_role?.data?.role_type || 'basic'}</div>
                                    )
                                }
                            </div>

                            <div className='userDetails'>
                                {
                                    (!editView) &&
                                        <div className={`m-0 ${(auth?.user?.email === null) ? 'd-none' : ''}`}>
                                            {auth?.user.email}
                                        </div>
                                }
                            </div>
                        </div>
                    </div>
                    : <UserEditForm setEditView={setEditView} />
            }
        </UserAccountStyles>
    )
}

export default UserAccount;