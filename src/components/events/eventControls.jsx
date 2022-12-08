import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPenSquare, faTrash } from '@fortawesome/free-solid-svg-icons';

import EditEvent from './editEvent'
import { useRemoveEventMutation } from '../../hooks/useEvents';

const EventControls = ({ event, inactive }) => {
    const { mutateAsync: removeEvent } = useRemoveEventMutation()
    const [ modalShow, setModalShow ] = useState(false)
    let navigate = useNavigate();
    const { pathname } = useLocation()

    const handleModalOpen = () => setModalShow(true)
    const handleModalClose = () => setModalShow(false)

    const deleteEvent = async (event_id) => {
        const event_removed = await removeEvent(event_id)

        console.log('the event has been removed!')
        console.log(event_removed)

        return
    }


    return (
        <div className='d-flex justify-content-between text-center mt-2'>
            {/* check to see if viewing event if so remove icon to view */}
            {
                (pathname.match(/\/event\/[0-9A-Za-z]{8}-[0-9A-Za-z]{4}-4[0-9A-Za-z]{3}-[89ABab][0-9A-Za-z]{3}-[0-9A-Za-z]{12}/) || inactive === true)
                    ? null
                    : <div className='border w-100 rounded bg-light' onClick={() => navigate(`/event/${event.event_id}`)}>
                        <FontAwesomeIcon icon={faEye} size='1x' />
                    </div> 
            }
            <div className='border w-100 rounded bg-light' onClick={handleModalOpen}>
                <FontAwesomeIcon icon={faPenSquare} />
            </div>
            <div className='border w-100 rounded bg-light' onClick={() => deleteEvent(event.event_id)}>
                <FontAwesomeIcon icon={faTrash} />
            </div>
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