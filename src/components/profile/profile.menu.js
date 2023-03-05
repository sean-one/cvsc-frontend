import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import styled from 'styled-components';

const Styles = styled.div`
    .profileMenu {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0.25rem 0;
    }

    .profileTab {
        cursor: pointer;
        color: #dcdbc4;
        border-right: 1px solid black;
        width: 100%;
        text-align: center;
        padding: 0.5rem 0;
    }

    .profileTab:first-child {
        border-left: 1px solid black;
    }

    .activeTab {
        color: #010a00;
        background-color: #dcdbc4
    }
`;


const ProfileMenu = () => {
    const { auth } = useAuth()
    const { pathname } = useLocation()
    let navigate = useNavigate()

    let menuTab = pathname.split('/')[2] || 'home'
    
    const buttonLink = (e) => {
        if(e.target.textContent.toLowerCase() === 'home') {
            navigate(`/profile/`)
        } else {
            navigate(`/profile/${e.target.textContent.toLowerCase()}`)
        }
    }

    return (
        <Styles>
            <div className='profileMenu'>
                <div className={`profileTab ${menuTab === 'home' ? 'activeTab' : ''}`} onClick={(e) => buttonLink(e)}>
                    Home
                </div>
                <div className={`profileTab ${menuTab === 'roles' ? 'activeTab' : ''}`} onClick={(e) => buttonLink(e)}>
                    Roles
                </div>
                <div className={`profileTab ${menuTab === 'events' ? 'activeTab' : ''}`} onClick={(e) => buttonLink(e)}>
                    Events
                </div>
                {
                    (auth.user.account_type >= process.env.REACT_APP_MANAGER_ACCOUNT) &&
                        <div className={`profileTab ${menuTab === 'management' ? 'activeTab' : ''}`} onClick={(e) => buttonLink(e)}>Admin</div>
                
                }
            </div>

        </Styles>
    )
}

export default ProfileMenu;