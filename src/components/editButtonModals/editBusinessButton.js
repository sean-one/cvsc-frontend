import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { Button, Col, Modal } from 'react-bootstrap';

import EditBusiness from '../business/editBusiness';

const EditBusinessButton = ({ business }) => {
    const [ modalShow, setModalShow ] = useState(false)

    const handleModalClose = () => setModalShow(false)
    const handleModalOpen = () => setModalShow(true)

    return (
        <Col sm={1} className='m-0 px-0'>
            <Button size='sm' variant='info' onClick={handleModalOpen}>
                <FontAwesomeIcon icon={faEdit} />
            </Button>
            <Modal show={modalShow} onHide={handleModalOpen}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Business</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <EditBusiness business={business} handleClose={handleModalClose} />
                </Modal.Body>
            </Modal>
        </Col>
    )
}

export default EditBusinessButton;