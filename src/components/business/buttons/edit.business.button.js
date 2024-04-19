import React from 'react';
import { useNavigate } from 'react-router-dom';

import { GoPencil } from 'react-icons/go';

const EditBusinessButton = ({ business }) => {
    let navigate = useNavigate()

    
    return (
        <div onClick={() => navigate(`/business/edit/${business.id}`, { state: business })}>
            <GoPencil className='siteIcons'/>
        </div>
    )
}

export default EditBusinessButton;