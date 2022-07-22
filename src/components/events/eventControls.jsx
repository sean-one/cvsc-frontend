import React, { useState } from 'react'
import { Button, Col, Modal, Row } from 'react-bootstrap'

import EditEvent from './editEvent'

const EventControls = ({ event }) => {
    const [ modalShow, setModalShow ] = useState(false)

    const handleModalOpen = () => setModalShow(true)
    const handleModalClose = () => setModalShow(false)

    return (
        <Row className='py-3'>
            <Col xs={4}>
                <Button variant='outline-success' href={`/event/${event.event_id}`}>View</Button>
            </Col>
            <Col xs={4}>
                <Button variant='outline-primary' onClick={handleModalOpen}>Edit</Button>
            </Col>
            <Col xs={4}>
                <Button variant='danger'>Delete</Button>
            </Col>
            <Modal show={modalShow} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Event</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <EditEvent event={event} handleClose={handleModalClose} />
                </Modal.Body>
            </Modal>
        </Row>
    )
}

export default EventControls