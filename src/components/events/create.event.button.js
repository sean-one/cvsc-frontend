import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarPlus } from 'react-icons/fa6';

const CreateEventButton = ({ business_id=null }) => {
    let navigate = useNavigate()


    return (
        <div onClick={() => navigate(`/event/create`, { state: { businessId: business_id }})}>
            <FaCalendarPlus className='siteIcons' style={{ color: 'var(--text-color)' }}/>
        </div>
    )
}

export default CreateEventButton;