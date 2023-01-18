import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClinicMedical, faTrash } from '@fortawesome/free-solid-svg-icons';


const VenueLabel = ({ venue_id, venue_name, business_role }) => {
    let navigate = useNavigate()

    const remove_business = () => {
        console.log('click')
    }


    return (
        <div className='d-flex justify-content-start align-items-center w-100'>
            {
                (business_role?.role_type >= process.env.REACT_APP_MANAGER_ACCOUNT)
                    ? <FontAwesomeIcon onClick={remove_business} icon={faTrash} className='me-2' />
                    : <FontAwesomeIcon onClick={() => navigate(`/business/${venue_id}`)} icon={faClinicMedical} className='me-2' />
            } 
            <div onClick={() => navigate(`/business/${venue_id}`)}>{venue_name}</div>
        </div>
    )
}

export default VenueLabel;