import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClinicMedical } from '@fortawesome/free-solid-svg-icons';


const BusinessVenue = ({ venue_id, venue_name, borderside }) => {
    return (
        <Link to={{ pathname: `/business/${venue_id}` }} className={`d-flex align-items-center py-1 w-100 border-${borderside || 'bottom'}`}>
            <FontAwesomeIcon icon={faClinicMedical} className='me-2' />
            <div>{venue_name}</div>
        </Link>
    )
}

export default BusinessVenue;