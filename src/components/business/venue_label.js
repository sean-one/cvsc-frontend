import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClinicMedical } from '@fortawesome/free-solid-svg-icons';


const VenueLabel = ({ venue_id, venue_name }) => {
    let navigate = useNavigate()


    return (
        <div className='w-100' onClick={() => navigate(`/business/${venue_id}`)}>
            <FontAwesomeIcon icon={faClinicMedical} className='me-2' />
            {venue_name}
        </div>
    )
}

export default VenueLabel;