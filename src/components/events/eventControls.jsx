import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Col, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPenSquare, faTrash } from '@fortawesome/free-solid-svg-icons';

import EditEvent from './editEvent'
import { useEventRemoveMutation } from '../../hooks/useEvents';

const EventControls = ({ event }) => {
    const { mutateAsync: removeEvent } = useEventRemoveMutation()
    const [ modalShow, setModalShow ] = useState(false)
    let history = useHistory();

    const handleModalOpen = () => setModalShow(true)
    const handleModalClose = () => setModalShow(false)

    const deleteEvent = async (event_id) => {
        const event_removed = await removeEvent(event_id)

        console.log('the event has been removed!')
        console.log(event_removed)

        return
    }


    return (
        <div className='d-flex justify-content-end'>
            <Col xs={2} className='text-success icon-button border-start border-end border-muted text-center' onClick={() => history.push(`/event/${event.event_id}`)}>
                <FontAwesomeIcon icon={faEye} size='1x' />
            </Col>
            <Col xs={2} className='text-primary icon-button text-center' onClick={handleModalOpen}>
                <FontAwesomeIcon icon={faPenSquare} />
            </Col>
            <Col xs={2} className='text-muted icon-button border-start border-end border-muted text-center' onClick={() => deleteEvent(event.event_id)}>
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