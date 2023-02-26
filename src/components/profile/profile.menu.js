import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import styled from 'styled-components';

const Styles = styled.div`
    .profileTab {
        border: 1px solid black;
        border-radius: 5px 5px 0 0;
        width: 100%;
        text-align: center;
        padding: 0.5rem 0;
        background-color: #A7AAA4;
    }

    .activeTab {
        background-color: #19381F;
        color: #A7AAA4;
        border: 1px solid #A7AAA4;
    }
`;


const ProfileMenu = () => {
    const { auth } = useAuth()
    const { pathname } = useLocation()
    let navigate = useNavigate()

    let menuTab = pathname.split('/')[2]
    
    const buttonLink = (e) => {
        navigate(`/profile/${e.target.textContent.toLowerCase()}`)
    }

    return (
        <Styles>
            {/* <div className='d-flex justify-content-between align-items-center py-2'> */}
            <div className='centerElement py-2'>
                <div className={`profileTab ${menuTab === 'profile' ? 'activeTab' : ''}`}>Profile</div>
                <div className={`profileTab ${menuTab === 'roles' ? 'activeTab' : ''}`} onClick={(e) => buttonLink(e)}>Roles</div>
                <div className={`profileTab ${menuTab === 'events' ? 'activeTab' : ''}`} onClick={(e) => buttonLink(e)}>Events</div>
                {
                    (auth.user.account_type >= process.env.REACT_APP_MANAGER_ACCOUNT) &&
                        <div className={`profileTab ${menuTab === 'management' ? 'activeTab' : ''}`} onClick={(e) => buttonLink(e)}>Management</div>
                }
            </div>

        </Styles>
    )
}

export default ProfileMenu;