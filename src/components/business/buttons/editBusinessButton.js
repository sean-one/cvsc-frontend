import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

import EditBusiness from '../editBusiness';

const EditBusinessButton = ({ business }) => {
    const [ modalShow, setModalShow ] = useState(false);

    const handleModalOpen = () => setModalShow(true);
    const handleModalClose = () => setModalShow(false);

    return (
        <div>
            <Button variant='outline-dark' onClick={handleModalOpen}>Edit Business</Button>
            <Modal show={modalShow} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit business</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <EditBusiness business={business} handleClose={handleModalClose} />
                </Modal.Body>
            </Modal>

        </div>
    )
}

export default EditBusinessButton;