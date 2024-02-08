import React from 'react';
import { useNavigate } from 'react-router-dom';

import { CreateEventIcon } from '../icons/siteIcons';

const CreateEventButton = () => {
    let navigate = useNavigate()


    return (
        <div onClick={() => navigate(`/event/create`)}>
            <CreateEventIcon />
        </div>
    )
}

export default CreateEventButton;