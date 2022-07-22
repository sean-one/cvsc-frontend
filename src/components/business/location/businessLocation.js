import React, { useContext } from 'react';
import { Col, Row } from 'react-bootstrap';
import EditLocationButton from '../../editButtonModals/editLocationButton';

import { useBusinessLocationQuery } from '../../../hooks/useBusinessApi';
import { UsersContext } from '../../../context/users/users.provider';


const BusinessLocation = ({ business }) => {
    const { data: business_location, isLoading } = useBusinessLocationQuery(business.id)
    const { userProfile } = useContext(UsersContext);

    if(isLoading) {
        return <div>loading...</div>
    }

    
    return (
        <Row className='d-flex pb-2 align-items-center'>
            <Col xs={10}>
                <Row>{business_location.data.street_address}</Row>
                <Row>{`${business_location.data.location_city}, ${business_location.data.location_state} ${business_location.data.zip_code}`}</Row>
            </Col>
            <Col xs={2}>
                {
                    (userProfile.id === business.business_admin) && (
                        <EditLocationButton business_location={business_location.data} />
                    )
                }
            </Col>
        </Row>
    )
}

export default BusinessLocation;