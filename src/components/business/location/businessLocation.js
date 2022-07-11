import React, { useContext } from 'react';
import { Col, Row } from 'react-bootstrap';
import EditLocationButton from '../../editButtonModals/editLocationButton';

import { UsersContext } from '../../../context/users/users.provider';


const BusinessLocation = ({ business }) => {
    const { userProfile } = useContext(UsersContext);
    
    return (
        <Row className='d-flex align-items-center m-2 fw-bold'>
            <Col className='d-flex justify-content-start align-items-center'>
                {
                    (userProfile.id === business.business_admin)
                        ? <EditLocationButton business_location={business} />
                        : null
                }
                {business.formatted}
            </Col>
        </Row>
    )
}

export default BusinessLocation;