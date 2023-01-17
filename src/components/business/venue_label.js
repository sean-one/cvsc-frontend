import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClinicMedical, faTrash } from '@fortawesome/free-solid-svg-icons';


const VenueLabel = ({ venue_id, venue_name, business_role }) => {
    let navigate = useNavigate()


    return (
        <div className='w-100' onClick={() => navigate(`/business/${venue_id}`)}>
            <FontAwesomeIcon icon={(business_role?.role_type >= process.env.REACT_APP_MANAGER_ACCOUNT) ? faTrash : faClinicMedical} className='me-2' />
            {venue_name}
        </div>
    )
}

export default VenueLabel;