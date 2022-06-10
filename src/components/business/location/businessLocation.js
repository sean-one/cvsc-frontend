import React from 'react';
import { Col, Row } from 'react-bootstrap';
import EditLocationButton from '../../editButtonModals/editLocationButton';



const BusinessLocation = ({ business, user_role }) => {
    
    return (
        <Row className='d-flex align-items-center m-2 fw-bold'>
            <Col className='d-flex justify-content-start align-items-center'>
                {
                    (user_role.role_type === 'admin')
                        ? <EditLocationButton business_location={business} />
                        : null
                }
                {business.formatted}
            </Col>
        </Row>
    )
}

export default BusinessLocation;