import React from 'react';
import { Modal } from 'react-bootstrap';

import EditBusiness from '../business/editBusiness';

const EditBusinessModal = (props) => {
    const business = props.business;

    return (
        <Modal centered show={props.modalshow} onHide={props.close}>
            <Modal.Header closeButton>
                <Modal.Title>{`${business.business_name}`}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <EditBusiness business={business} handleClose={props.close} />
            </Modal.Body>
        </Modal>
    )
}

export default EditBusinessModal;