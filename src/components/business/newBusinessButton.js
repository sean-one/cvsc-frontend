import React, { useState } from 'react'
import { Button, Modal } from 'react-bootstrap';

import CreateBusiness from './createBusiness';

const NewBusinessButton = () => {
    const [ modalShow, setModalShow ] = useState(false)

    const handleModalOpen = () => setModalShow(true)
    const handleModalClose = () => setModalShow(false)

    return (
        <>
            <Button variant='outline-dark' onClick={handleModalOpen}>Create New Business</Button>
            <Modal show={modalShow} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create new business</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CreateBusiness />
                </Modal.Body>
            </Modal>
        </>
        
    )
}

export default NewBusinessButton;