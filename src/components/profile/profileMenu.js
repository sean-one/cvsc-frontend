import React from 'react';
import { useNavigate } from 'react-router-dom';


const ProfileMenu = () => {
    let navigate = useNavigate()

    const buttonLink = (e) => {
        navigate(`/profile/${e.target.textContent}`)
    }

    return (
        <div className='d-flex justify-content-between align-items-center py-2'>
            <div className='border border-dark rounded-top w-100 text-center' onClick={(e) => buttonLink(e)}>Roles</div>
            <div className='border border-dark rounded-top w-100 text-center' onClick={(e) => buttonLink(e)}>Events</div>
            <div className='border border-dark rounded-top w-100 text-center' onClick={(e) => buttonLink(e)}>Management</div>
        </div>
    )
}

export default ProfileMenu;