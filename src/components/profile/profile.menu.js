import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import styled from 'styled-components';

const Styles = styled.div`
    .profileMenu {
        margin: 0.25rem 0;
    }

    .profileTab {
        border: 1px solid black;
        border-radius: 5px 5px 0 0;
        width: 100%;
        text-align: center;
        padding: 0.5rem 0;
    }

    .activeTab {
        color: #A7AAA4;
        border: 1px solid #A7AAA4;
    }
`;


const ProfileMenu = () => {
    const { auth } = useAuth()
    const { pathname } = useLocation()
    let navigate = useNavigate()

    let menuTab = pathname.split('/')[2] || 'home'
    
    const buttonLink = (e) => {
        console.log(e.target.textContent.toLowerCase())
        if(e.target.textContent.toLowerCase() === 'home') {
            navigate(`/profile/`)
        } else {
            navigate(`/profile/${e.target.textContent.toLowerCase()}`)
        }
    }

    console.log(menuTab)
    return (
        <Styles>
            <div className='centerElement profileMenu'>
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