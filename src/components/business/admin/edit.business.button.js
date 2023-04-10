import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EditIcon } from '../../icons/siteIcons';

const EditBusinessButton = ({ business }) => {
    let navigate = useNavigate()

    
    return (
        <button>
            <EditIcon onClick={() => navigate(`/business/edit/${business.id}`, { state: business })} />
        </button>
    )
}

export default EditBusinessButton;