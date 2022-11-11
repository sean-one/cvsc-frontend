import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';


const ViewBusinessButton = ({ business_id }) => {
    let navigate = useNavigate()

    const businessLink = () => {
        navigate(`/business/${business_id}`)
    }

    return (
        <div>
            <FontAwesomeIcon icon={faEye} onClick={businessLink} />
            {/* <Button variant='outline-dark' onClick={businessLink}>View Business</Button> */}
        </div>
    )
    
}

export default ViewBusinessButton;