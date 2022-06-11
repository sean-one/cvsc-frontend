import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Button, Col, Modal } from 'react-bootstrap';

import AxiosInstance from '../../helpers/axios';
import { SiteContext } from '../../context/site/site.provider';
import { UsersContext } from '../../context/users/users.provider';
import EditBusiness from '../business/editBusiness';

const EditBusinessButton = ({ business }) => {
    const { removeBusiness } = useContext(SiteContext)
    const { removeUserRole } = useContext(UsersContext)
    const [ modalShow, setModalShow ] = useState(false)
    let history = useHistory()

    const handleModalClose = () => setModalShow(false)
    const handleModalOpen = () => setModalShow(true)

    const deleteBusiness = (e) => {
        const business_id = e.currentTarget.value
        const token = localStorage.getItem('token')

        AxiosInstance.delete(`/business/remove/${business_id}`, {
            headers: { 'Authorization': 'Bearer ' + token }
        })
            .then(response => {
                removeBusiness(business_id)
                removeUserRole(business_id)

                history.push('/profile')
            })
            .catch(err => console.log(err))
    }

    return (
        <Col className='d-flex mx-1'>
            <Col className='m-0 px-1'>
                <Button size='sm' variant='info' onClick={handleModalOpen}>
                    <FontAwesomeIcon icon={faEdit} />
                </Button>
            </Col>
            <Col className='m-0 px-1'>
                <Button size='sm' variant='danger' onClick={(e) => deleteBusiness(e)} value={business.id}>
                    <FontAwesomeIcon icon={faTrash} />
                </Button>
            </Col>
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