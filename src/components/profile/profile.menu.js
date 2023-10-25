import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import styled from 'styled-components';

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
    const { auth } = useAuth()
    const { pathname } = useLocation()
    let navigate = useNavigate()

    let menuTab = pathname.split('/')[2] || 'home'
    
    const buttonLink = (e) => {
        const route = e.target.getAttribute('data-route');
        navigate(route);
    }

    const userHasRole = (roleType) => {
        return auth?.roles.some(role => role.active_role === true && role.role_type >= roleType);
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
                        return (
                            <div
                                key={tab.route}
                                data-route={tab.route}
                                className={`profileTab ${menuTab === tab.route.split('/')[2] ? 'activeTab' : ''}`}
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