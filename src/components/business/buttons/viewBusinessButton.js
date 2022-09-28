import React from 'react';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';


const ViewBusinessButton = ({ business_id }) => {
    let history = useHistory()

    const businessLink = () => {
        history.push(`/business/${business_id}`)
    }

    return (
        <div>
            <FontAwesomeIcon icon={faEye} onClick={businessLink} />
            {/* <Button variant='outline-dark' onClick={businessLink}>View Business</Button> */}
        </div>
    )
    
}

export default ViewBusinessButton;