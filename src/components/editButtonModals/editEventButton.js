import React, { useContext, useState } from 'react'
import { Button, Col, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

import AxiosInstance from '../../helpers/axios';
import EditEvent from '../events/editEvent';
import { SiteContext } from '../../context/site/site.provider';
import { NotificationsContext } from '../../context/notifications/notifications.provider';

const EditEventButton = ({ event }) => {
    const { removeEvent } = useContext(SiteContext)
    const { dispatch } = useContext(NotificationsContext)
    const [ modalShow, setModalShow ] = useState(false)

    const handleModalClose = () => setModalShow(false)
    const handleModalOpen = () => setModalShow(true)


    const deleteEvent = (e) => {
        const event_id = e.currentTarget.value
        const token = localStorage.getItem('token')
        AxiosInstance.delete(`/events/remove/${event_id}`, {
            headers: { 'Authorization': 'Bearer ' + token }
        })
            .then(response => {
                removeEvent(event_id)
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_typ: 'SUCCESS',
                        message: 'event has been removed'
                    }
                })
            })
            .catch(err => console.log(err))
    }

    return (
        <Col sm={2} className='d-flex mx-1'>
            <Col className='m-0 px-1'>
                <Button size='sm' variant='info' onClick={handleModalOpen}>
                    <FontAwesomeIcon icon={faEdit} />
                </Button>
            </Col>
            <Col className='m-0 px-1'>
                <Button size='sm' variant='danger' onClick={(e) => deleteEvent(e)} value={event.event_id}>
                    <FontAwesomeIcon icon={faTrash} />
                </Button>
            </Col>
            <Modal show={modalShow} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Event</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <EditEvent event={event} handleClose={handleModalClose}/>
                </Modal.Body>
            </Modal>
        </Col>
    )

}

export default EditEventButton;