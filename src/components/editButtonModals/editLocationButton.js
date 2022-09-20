import React, { useState } from 'react';
import { Col, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';

import EditLocation from '../business/location/editLocation';
import LoadingSpinner from '../loadingSpinner';
import { useBusinessLocationQuery } from '../../hooks/useBusinessApi';

const EditLocationButton = ({ business_id }) => {
    const { data: business_location, isLoading } = useBusinessLocationQuery(business_id)
    const [ modalShow, setModalShow ] = useState(false)

    const handleModalClose = () => setModalShow(false)
    const handleModalOpen = () => setModalShow(true)

    if(isLoading) {
        return <LoadingSpinner />
    }

    return (
        <Col xs={1} className='px-0'>
            <FontAwesomeIcon icon={faPencilAlt} onClick={handleModalOpen} />
            <Modal show={modalShow} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{`Edit ${business_location.data.venue_name} Location`}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <EditLocation business_location={business_location.data} modalClose={handleModalClose} />
                </Modal.Body>
            </Modal>
        </Col>
    )
}

export default EditLocationButton;