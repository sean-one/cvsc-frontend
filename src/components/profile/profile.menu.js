import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import useAuth from '../../hooks/useAuth';
import useNotification from '../../hooks/useNotification';
import { useUserAccountRole } from '../../hooks/useRolesApi';

const ProfileMenuStyles = styled.div`
    .profileMenu {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 0.75rem;
    }

    .profileTab {
        cursor: pointer;
        color: var(--main-color);
        border-right: 0.1rem solid var(--main-color);
        width: 100%;
        text-align: center;
        padding: 0.75rem 0;
    }

    .profileTab:first-child {
        border-left: 0.1rem solid var(--main-color);
    }

    .activeTab {
        color: var(--main-highlight-color);
        font-weight: bold;
        letter-spacing: 0.015rem;
    }
`;


const ProfileMenu = () => {
    const { auth, user_reset } = useAuth();
    const { dispatch } = useNotification();
    const { data: user_account_role, isError, error: user_account_role_error } = useUserAccountRole(auth?.user?.id)
    const { pathname } = useLocation()

    let navigate = useNavigate()

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

    let menuTab;
    if (pathname === '/profile') {
        menuTab = '';
    } else {
        menuTab = pathname.split('/')[2] || '';
    }
    
    const buttonLink = (e) => {
        const route = e.target.getAttribute('data-route');
        navigate(route);
    }

    const userHasRole = (role_constraint, user_role) => {
        const roleHierarchy = {
            'basic': 1,
            'creator': 2,
            'manager': 3,
            'admin': 4
        };

        return roleHierarchy[user_role] >= roleHierarchy[role_constraint]
        
    };

    const tabs = [
        { label: 'Account', route: '/profile/' },
        { label: 'Roles', route: '/profile/roles' },
        { label: 'Events', route: '/profile/events', condition: userHasRole('creator', user_account_role?.data?.role_type) },
        { label: 'Admin', route: '/profile/admin', condition: userHasRole('manager', user_account_role?.data?.role_type) },
    ];

    
    return (
        <ProfileMenuStyles>
            <div className='profileMenu'>
                {tabs.map(tab => {
                    if (tab.condition === undefined || tab.condition) {
                        let isActive = menuTab === tab.route.split('/')[2];
                        if (tab.label === 'Account') {
                            isActive = isActive || menuTab === '';
                        }

                        return (
                            <div
                                key={tab.route}
                                data-route={tab.route}
                                className={`profileTab ${isActive ? 'activeTab' : ''}`}
                                onClick={buttonLink}
                            >{tab.label}</div>
                        );
                    }
                    return null;
                })}
            </div>
        </ProfileMenuStyles>
    )
}

export default ProfileMenu;