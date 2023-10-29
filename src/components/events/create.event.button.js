import React from 'react';
import { useNavigate } from 'react-router-dom';

import { CreateEventIcon } from '../icons/siteIcons';

const CreateEventButton = ({ business_id }) => {
    let navigate = useNavigate()

    return (
        <div onClick={() => navigate(`/event/create`, { state: business_id })}>
            <CreateEventIcon />
        </div>
    )
}

export default CreateEventButton;