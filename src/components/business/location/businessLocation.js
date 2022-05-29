import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { Button, Col, Modal, Row } from 'react-bootstrap';

import EditLocation from './editLocation';


const BusinessLocation = (props) => {
    const business = props.business;
    const [modalShow, setModalShow] = useState(false)

    const handleModalClose = () => setModalShow(false)
    const handleModalOpen = () => setModalShow(true)
    
    return (
        <Row className='d-flex align-items-center m-2 fw-bold'>
            <Col>
                <Button size='sm' variant='success' className='m-2'>
                    <FontAwesomeIcon icon={faEdit} onClick={handleModalOpen} />
                </Button>
                {business.formatted}
            </Col>
            <Modal centered show={modalShow} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{`${business.business_name} location`}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <EditLocation modalClose={handleModalClose} business_location={business} />
                </Modal.Body>
            </Modal>
        </Row>
    )
}

export default BusinessLocation;