import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import useAuth from '../../hooks/useAuth';
import useNotification from '../../hooks/useNotification';
import { useUserRolesQuery } from '../../hooks/useRolesApi';

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
    const { data: user_roles_response, status: user_roles_status, error: user_roles_error } = useUserRolesQuery(auth?.user?.id)
    const { pathname } = useLocation()
    let user_roles = []

    if (user_roles_status === 'error') {
        dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
                notification_type: 'ERROR',
                message: user_roles_error?.response?.data?.error?.message
            }
        })
    }

    if (user_roles_status === 'success') {
        console.log('did that shit')
    }

    let navigate = useNavigate()

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

    const userHasRole = (role_type) => {
        user_roles = user_roles_response?.data.filter(role => (role.role_type >= role_type) && role.active_role)
        if (user_roles?.length > 0) {
            return true
        } else {
            return false
        }
    };

    const tabs = [
        { label: 'Account', route: '/profile/' },
        { label: 'Roles', route: '/profile/roles' },
        { label: 'Events', route: '/profile/events', condition: userHasRole(process.env.REACT_APP_CREATOR_ACCOUNT) },
        { label: 'Admin', route: '/profile/admin', condition: userHasRole(process.env.REACT_APP_MANAGER_ACCOUNT) },
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