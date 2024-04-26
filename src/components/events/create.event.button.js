import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarPlus } from 'react-icons/fa6';

const CreateEventButton = () => {
    let navigate = useNavigate()


    return (
        <div onClick={() => navigate(`/event/create`)}>
            <FaCalendarPlus className='siteIcons' style={{ color: 'var(--text-color)' }}/>
        </div>
    )
}

export default CreateEventButton;