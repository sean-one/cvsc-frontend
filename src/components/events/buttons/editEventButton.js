import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';

import EditEvent from '../editEvent';

const EditEventButton = ({ event, venue_role, brand_role }) => {
    const [ modalShow, setModalShow ] = useState(false)

    const handleModalOpen = () => setModalShow(true)
    const handleModalClose = () => setModalShow(false)


    return (
        <div>
            <FontAwesomeIcon icon={faPencilAlt} onClick={handleModalOpen} />
            <Modal show={modalShow} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Event</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <EditEvent event={event} handleClose={handleModalClose} />
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default EditEventButton;