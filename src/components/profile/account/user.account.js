import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaUserPen } from 'react-icons/fa6';
import { MdVerified, MdOutlineVerified } from 'react-icons/md';

import useAuth from '../../../hooks/useAuth';
import useNotification from '../../../hooks/useNotification';
import UserEditForm from '../../forms/user.edit.form';
import { useUserAccountRole } from '../../../hooks/useRolesApi';
import LoadingSpinner from '../../loadingSpinner';
import AxiosInstance from '../../../helpers/axios';

const UserAccountStyles = styled.div`
    .userAccountPage {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 0 0.375rem;
        padding: 2.25rem 0.75rem 0.75rem;
        border: 0.1rem solid var(--text-color);
        border-radius: 5px;
        /* background: var(--opacity); */
    }

    .profileImage {
        position: relative;
        width: 100%;
    }
    
    .userEditButton {
        padding: 1rem;
        position: absolute;
        right: 10%;
        bottom: 0;
        border: 0.1rem solid var(--text-color);
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
        gap: 1rem;
    }
    
    .usernameHeader {
        font-weight: bold;
        font-size: 2.25rem;
        align-self: flex-end;
        overflow: hidden;
        text-overflow: ellipsis;
        display: block;
    }
    
    .accountTypeHeader {
        align-self: flex-end;
    }

    .userDetails {
        color: var(--text-color);
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .userEmail {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 0.5rem;
    }

    .accountEmail {
        font-size: clamp(1.2rem, 5vw, 1.4rem);
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        white-space: normal;
    }

    .nonVerified {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 0.3rem;
        cursor: pointer;
    }

    .nonVerifiedText {
        font-size: var(--small-font);
    }

    .sm_button {
        width: 5rem;
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
    const [ editView, setEditView ] = useState(false);
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

    const user_profile_image = auth?.user?.avatar === null ? `${process.env.PUBLIC_URL}/assets/default_user_icon.webp` : `${process.env.REACT_APP_BACKEND_IMAGE_URL}${auth?.user?.avatar}`;

    const verifyEmailButton = async () => {
        try {
            const response = await AxiosInstance.post('/users/send-verification-email')

            if (response?.status === 200) {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'SUCCESS',
                        message: response?.data?.message
                    }
                })
            }

        } catch (error) {
            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'ERROR',
                    message: error?.response?.data?.error?.message
                }
            })
        }
    }


    return (
        <UserAccountStyles>
            {
                !editView
                    ? <div className='userAccountPage'>
                        
                        <div className='profileImage'>
                            <img
                                src={user_profile_image}
                                alt={`user avatar`}
                            />
                            {
                                (!editView) &&
                                    <div className='userEditButton' onClick={() => setEditView(true)}>
                                        <label className='inputLabel removeInputLabelPadding'>
                                            <FaUserPen className='siteIcons' />
                                        </label>
                                    </div>
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
                                        <div className='userEmail'>
                                            <div className='accountEmail'>
                                                {auth?.user.email}
                                            </div>
                                            {
                                                auth?.user?.email_verified
                                                    ? <div><MdVerified /></div>
                                                    : <div className='buttonLike nonVerified' onClick={verifyEmailButton}>
                                                        <MdOutlineVerified style={{ color: 'var(--main-highlight-color)' }} />
                                                        <div className='nonVerifiedText'>validate</div>
                                                    </div>
                                            }
                                        </div>
                                }
                            </div>
                            {
                                (auth?.user?.is_superadmin) &&
                                    <div className='sm_button' onClick={() => navigate('/squirrelmaster')}>
                                        <img src={`${process.env.PUBLIC_URL}/assets/squirrel-master.webp`} alt='squirrel'/>
                                    </div>
                            }
                        </div>
                    </div>
                    : <UserEditForm setEditView={setEditView} />
            }
        </UserAccountStyles>
    )
}

export default UserAccount;