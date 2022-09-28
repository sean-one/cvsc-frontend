import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarPlus } from '@fortawesome/free-solid-svg-icons';

// import AddEvent from '../addEvent';
import CreateEvent from '../createEvent';

const CreateEventButton = () => {
    const [ modalShow, setModalShow ] = useState(false)

    const handleModalOpen = () => setModalShow(true);
    const handleModalClose = () => setModalShow(false);

    return (
        <div>
            <FontAwesomeIcon icon={faCalendarPlus} onClick={handleModalOpen} />
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