import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

import CreateBusiness from '../createBusiness';

const CreateBusinessButton = () => {
    const [ modalShow, setModalShow ] = useState(false);

    const handleModalOpen = () => setModalShow(true)
    const handleModalClose = () => setModalShow(false)

    return (
        <div>
            <Button variant='outline-dark' onClick={handleModalOpen}>Create New Business</Button>
            <Modal show={modalShow} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create new business</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CreateBusiness />
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default CreateBusinessButton;