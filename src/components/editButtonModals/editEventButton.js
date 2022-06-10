import React, { useState, useContext } from 'react'
import { Button, Col, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

import EditEvent from '../events/editEvent';


const EditEventButton = ({ event }) => {
    const [ modalShow, setModalShow ] = useState(false)

    const handleModalClose = () => setModalShow(false)
    const handleModalOpen = () => setModalShow(true)

    return (
        <Col sm={1} className='m-0 px-0'>
            <Button size='sm' variant='info' onClick={handleModalOpen}>
                <FontAwesomeIcon icon={faEdit} />
            </Button>
            <Modal show={modalShow} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Event</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <EditEvent event={event} handleClose={handleModalClose}/>
                </Modal.Body>
            </Modal>
        </Col>
    )

}

export default EditEventButton;