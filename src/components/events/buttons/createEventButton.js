import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

// import AddEvent from '../addEvent';
import CreateEvent from '../createEvent';

const CreateEventButton = () => {
    const [ modalShow, setModalShow ] = useState(false)

    const handleModalOpen = () => setModalShow(true);
    const handleModalClose = () => setModalShow(false);

    return (
        <div>
            <Button variant='outline-dark' onClick={handleModalOpen}>Create New Event</Button>
            <Modal show={modalShow} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create new event</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CreateEvent />
                    {/* <AddEvent /> */}
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default CreateEventButton;