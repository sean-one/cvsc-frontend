import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPen } from '@fortawesome/free-solid-svg-icons';

import EditBusiness from '../businessForms/editBusiness';

const EditBusinessButton = ({ business, role }) => {
    const [ modalShow, setModalShow ] = useState(false);

    const handleModalOpen = () => setModalShow(true);
    const handleModalClose = () => setModalShow(false);

    return (
        <div>
            <div className='w-100' onClick={handleModalOpen}>
                <div>Edit Business</div>
            </div>
            {/* <FontAwesomeIcon icon={faPen} onClick={handleModalOpen} /> */}
            <Modal show={modalShow} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit business</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <EditBusiness business={business} handleClose={handleModalClose} role={role} />
                </Modal.Body>
            </Modal>

        </div>
    )
}

export default EditBusinessButton;