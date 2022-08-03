import React, { useState } from 'react'
import { Button, Modal } from 'react-bootstrap';
import CreateEvent from './createEvent';


const NewEventButton = () => {
  const [ modalShow, setModalShow ] = useState(false)

  const handleModalShow = () => setModalShow(true)
  const handleModalClose = () => setModalShow(false)
  
  return (
    <>
        <Button variant='outline-dark' onClick={handleModalShow}>Create New Event</Button>
        <Modal show={modalShow} onHide={handleModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>Create New Event</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <CreateEvent />
          </Modal.Body>
        </Modal>
    </>
  )
}

export default NewEventButton;