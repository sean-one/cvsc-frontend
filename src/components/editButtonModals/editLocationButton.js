import React, { useState } from 'react';
import { Button, Col, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

import EditLocation from '../business/location/editLocation';

const EditLocationButton = ({ business_location }) => {
    const [ modalShow, setModalShow ] = useState(false)

    const handleModalClose = () => setModalShow(false)
    const handleModalOpen = () => setModalShow(true)


    return (
        <Col sm={1} className='m-0 px-0'>
            <Button size='sm' variant='success' onClick={handleModalOpen}>
                <FontAwesomeIcon icon={faEdit} />
            </Button>
            <Modal show={modalShow} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Location</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <EditLocation business_location={business_location} modalClose={handleModalClose} />
                </Modal.Body>
            </Modal>
        </Col>
    )
}

export default EditLocationButton;