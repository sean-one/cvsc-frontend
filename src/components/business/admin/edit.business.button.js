import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';


const EditBusinessButton = ({ business }) => {
    let navigate = useNavigate()

    
    return (
        <button>
            <FontAwesomeIcon icon={faPen} onClick={() => navigate(`/business/edit/${business.id}`, { state: business })} />
        </button>
    )
}

export default EditBusinessButton;