import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';


const ProfileMenu = () => {
    const { auth } = useAuth()
    const { pathname } = useLocation()
    let navigate = useNavigate()

    let menuTab = pathname.split('/')[2]
    
    const buttonLink = (e) => {
        navigate(`/profile/${e.target.textContent.toLowerCase()}`)
    }

    return (
        <div className='d-flex justify-content-between align-items-center py-2'>
            <div className={`border border-dark rounded-top w-100 text-center ${menuTab === 'roles' ? 'bg-dark text-white' : ''}`} onClick={(e) => buttonLink(e)}>Roles</div>
            <div className={`border border-dark rounded-top w-100 text-center ${menuTab === 'events' ? 'bg-dark text-white' : ''}`} onClick={(e) => buttonLink(e)}>Events</div>
            {
                (auth.user.account_type >= 456) &&
                    <div className={`border border-dark rounded-top w-100 text-center ${menuTab === 'management' ? 'bg-dark text-white' : ''}`} onClick={(e) => buttonLink(e)}>Management</div>
            }
        </div>
    )
}

export default ProfileMenu;