import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClinicMedical } from '@fortawesome/free-solid-svg-icons';


const BusinessVenue = ({ venue_id, venue_name }) => {
    return (
        <div className='d-flex align-items-center border-bottom py-1'>
            <FontAwesomeIcon icon={faClinicMedical} className='me-2' />
            <Link to={{ pathname: `/business/${venue_id}` }}>{venue_name}</Link>
        </div>
    )
}

export default BusinessVenue;