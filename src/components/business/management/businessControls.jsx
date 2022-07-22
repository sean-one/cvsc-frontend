import React, { useState } from 'react';
import { Button, Col, Modal, Row } from 'react-bootstrap';

import EditBusiness from '../editBusiness';
import { useActiveBusinessMutation } from '../../../hooks/useBusinessApi';

const BusinessControls = ({ business }) => {
    const { mutateAsync: toggleActiveBusiness } = useActiveBusinessMutation()
    const [ activeBusiness, setActiveBusiness ] = useState(business.active_business)
    const [ modalShow, setModalShow ] = useState(false)

    const handleModalOpen = () => setModalShow(true);
    const handleModalClose = () => setModalShow(false);

    const toggleActive = async (e) => {
        // console.log(e.target.value)
        const business_toggled = await toggleActiveBusiness(e.target.value)

        setActiveBusiness(business_toggled.data.active_business)
        // console.log(business_toggled)
    }

    return (
        <Row className='py-2'>
            <Col xs={6}>
                <Button value={business.id} variant='outline-dark' onClick={(e) =>{toggleActive(e)}} >
                    {activeBusiness ? 'Set Business Inactive' : 'Set Business Active'}
                </Button>
            </Col>
            <Col xs={3}>
                <Button variant='outline-dark' onClick={handleModalOpen}>Edit</Button>
            </Col>
            <Col xs={3}>
                <Button variant='danger'>Delete</Button>
            </Col>
            <Modal show={modalShow} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{business.business_name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <EditBusiness business={business} handleClose={handleModalClose} />
                </Modal.Body>
            </Modal>
        </Row>
    )
}

export default BusinessControls;