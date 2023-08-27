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
        color: var(--main-text-color);
    }
`;


const ProfileMenu = () => {
    const { auth } = useAuth()
    const { pathname } = useLocation()
    let navigate = useNavigate()

    let menuTab = pathname.split('/')[2] || 'home'
    
    const buttonLink = (e) => {
        if(e.target.textContent.toLowerCase() === 'account') {
            navigate(`/profile/`)
        } else {
            navigate(`/profile/${e.target.textContent.toLowerCase()}`)
        }
    }

    console.log(auth)
    return (
        <ProfileMenuStyles>
            <div className='profileMenu'>
                <div className={`profileTab ${menuTab === 'home' ? 'activeTab' : ''}`} onClick={(e) => buttonLink(e)}>
                    Account
                </div>
                <div className={`profileTab ${menuTab === 'roles' ? 'activeTab' : ''}`} onClick={(e) => buttonLink(e)}>
                    Roles
                </div>
                {
                    (auth.user.account_type >= process.env.REACT_APP_CREATOR_ACCOUNT) &&
                        <div className={`profileTab ${menuTab === 'events' ? 'activeTab' : ''}`} onClick={(e) => buttonLink(e)}>Events</div>
                }
                {
                    (auth.user.account_type >= process.env.REACT_APP_MANAGER_ACCOUNT) &&
                        <div className={`profileTab ${menuTab === 'admin' ? 'activeTab' : ''}`} onClick={(e) => buttonLink(e)}>Admin</div>
                }
            </div>

        </ProfileMenuStyles>
    )
}

export default ProfileMenu;