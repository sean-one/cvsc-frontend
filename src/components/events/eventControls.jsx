import React, { useState } from 'react';
import { Button, Col, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPenSquare, faTrash } from '@fortawesome/free-solid-svg-icons';

import EditEvent from './editEvent'

const EventControls = ({ event }) => {
    const [ modalShow, setModalShow ] = useState(false)

    const handleModalOpen = () => setModalShow(true)
    const handleModalClose = () => setModalShow(false)

    return (
        <div className='d-flex justify-content-end'>
            <Col xs={2} className='text-success icon-button border-start border-end border-muted text-center' href={`/event/${event.event_id}`}>
                {/* <Button size='sm' variant='outline-success' >View</Button> */}
                <FontAwesomeIcon icon={faEye} size='1x' />
            </Col>
            <Col xs={2} className='text-primary icon-button text-center' onClick={handleModalOpen}>
                {/* <Button size='sm' variant='outline-primary' >Edit</Button> */}
                <FontAwesomeIcon icon={faPenSquare} />
            </Col>
            <Col xs={2} className='text-danger icon-button border-start border-end border-muted text-center'>
                {/* <Button size='sm' variant='danger'>Delete</Button> */}
                <FontAwesomeIcon icon={faTrash} />
            </Col>
            <Modal show={modalShow} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Event</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <EditEvent event={event} handleClose={handleModalClose} />
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default EventControls