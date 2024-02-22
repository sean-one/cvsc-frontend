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
        border: 1px solid var(--trim-color);
        flex-direction: column;
        align-items: center;
        margin: 0 0.375rem;
        padding: 2.25rem 0.75rem 0.75rem;
        border-radius: 5px;
    }

    .profileImage {
        position: relative;
        min-width: 225px;
        max-width: 275px;

        canvas {
            max-width: 100%;
            border: 1px solid var(--trim-color);
            display: block;
            border-radius: 50%;
        }
        
        img {
            width: 100%;
            border: 1px solid var(--trim-color);
            display: block;
            border-radius: 50%;
        }
    }
    
    .userEditButton {
        padding: 0.75rem;
        position: absolute;
        right: 15%;
        bottom: 0;
        border: 1px solid var(--secondary-color);
        border-radius: 50%;
        color: var(--trim-color);
        background-color: var(--main-color);
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
        height: 100%;
    }

    .updateWrapper {
        display: flex;
        justify-content: space-between;
        align-content: center;
    }
    
    .notificationTester {
        color: black;
        background-color: green;
        border: 1px solid black;
        padding: 0.75rem;
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

    const testNotification = () => {
        dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
                notification_type: 'ERROR',
                message: 'this is the tester for notifications'
            }
        })
    }


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

                            <div className='notificationTester' onClick={testNotification}>test notification</div>
                            
                        </div>
                    </div>
                    : <UserEditForm setEditView={setEditView} />
            }
        </UserAccountStyles>
    )
}

export default UserAccount;