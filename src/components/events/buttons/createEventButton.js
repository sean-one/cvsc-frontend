import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';

import CreateEvent from '../createEvent';

const CreateEventButton = () => {
    const [ modalShow, setModalShow ] = useState(false)

    const handleModalOpen = () => setModalShow(true);
    const handleModalClose = () => setModalShow(false);

    return (
        <div>
            <div className='w-100' onClick={handleModalOpen}>
                <div className='text-center py-2'>Create New Event</div>
            </div>
            <Modal show={modalShow} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create new event</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CreateEvent />
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default CreateEventButton;