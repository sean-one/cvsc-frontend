import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { Button, Col, Row } from 'react-bootstrap';


const BusinessLocation = (props) => {
    const business = props.business;
    
    return (
        <Row className='d-flex align-items-center m-2 fw-bold'>
            <Col>
                <Button size='sm' variant='success' className='m-2'>
                    <FontAwesomeIcon icon={faEdit} />
                </Button>
                {business.formatted}
            </Col>
        </Row>
    )
}

export default BusinessLocation;