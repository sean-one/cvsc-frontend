import React from 'react';
import { Modal } from 'react-bootstrap';

const EditLocationModal = (props) => {
    const business = props.business;

    return (
        <Modal centered show={props.modalshow} onHide={props.close}>
            <Modal.Header closeButton>
                <Modal.Title>{`${business.business_name} location`}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>edit the location</p>
            </Modal.Body>
        </Modal>
    )
}

export default EditLocationModal;