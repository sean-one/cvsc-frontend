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
        margin-bottom: 0.5rem;
    }

    .profileTab {
        cursor: pointer;
        color: var(--secondary-text-color);
        border-right: 1px solid var(--secondary-text-color);
        width: 100%;
        text-align: center;
        padding: 0.5rem 0;
    }

    .profileTab:first-child {
        border-left: 1px solid var(--secondary-text-color);
    }

    .activeTab {
        color: var(--trim-color);
        font-weight: bold;
        letter-spacing: 0.01rem;
    }
`;


const ProfileMenu = () => {
    const { auth } = useAuth();
    const { dispatch } = useNotification();
    const { data: user_account_role, status: user_account_role_status, error: user_account_role_error } = useUserAccountRole(auth?.user?.id)
    const { pathname } = useLocation()

    let navigate = useNavigate()

    useEffect(() => {
        if (user_account_role_status === 'error') {
            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'ERROR',
                    message: user_account_role_error?.response?.data?.error?.message
                }
            })
        }
    }, [dispatch, user_account_role_status, user_account_role_error])

    let menuTab
    if (pathname === '/profile/') {
        menuTab = '';
    } else {
        menuTab = pathname.split('/')[2] || 'home';
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