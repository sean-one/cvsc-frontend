import React from 'react';
import { useNavigate } from 'react-router-dom';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPen } from '@fortawesome/free-solid-svg-icons';
import { EditIcon } from '../../icons/siteIcons';

const EditBusinessButton = ({ business }) => {
    let navigate = useNavigate()

    
    return (
        <button>
            <EditIcon onClick={() => navigate(`/business/edit/${business.id}`, { state: business })} />
            {/* <FontAwesomeIcon icon={faPen}  /> */}
        </button>
    )
}

export default EditBusinessButton;