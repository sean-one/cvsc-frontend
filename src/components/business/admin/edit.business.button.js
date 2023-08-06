import React from 'react';
import { useNavigate } from 'react-router-dom';

const EditBusinessButton = ({ business }) => {
    let navigate = useNavigate()

    
    return (
        <button onClick={() => navigate(`/business/edit/${business.id}`, { state: business })}>
            Edit
        </button>
    )
}

export default EditBusinessButton;