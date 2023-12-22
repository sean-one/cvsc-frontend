import React from 'react';
import { useNavigate } from 'react-router-dom';

import { EditIcon } from '../../icons/siteIcons';

const EditBusinessButton = ({ business }) => {
    let navigate = useNavigate()

    
    return (
        <div onClick={() => navigate(`/business/edit/${business.id}`, { state: business })}>
            <EditIcon />
        </div>
    )
}

export default EditBusinessButton;