import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from 'react-bootstrap';


const ViewBusinessButton = ({ business_id }) => {
    let history = useHistory()

    const businessLink = () => {
        history.push(`/business/manage/${business_id}`)
    }

    return (
        <div>
            <Button variant='outline-dark' onClick={businessLink}>View Business</Button>
        </div>
    )
    
}

export default ViewBusinessButton;