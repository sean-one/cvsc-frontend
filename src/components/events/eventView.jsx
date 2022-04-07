import React, { useState, useEffect, useContext } from 'react'
import { Button, Col, Container, Image, Modal, Row } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationArrow, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'

import { formatTime } from '../../helpers/formatTime';
import { SiteContext } from '../../context/site/site.provider';

import UpcomingEventView from '../upcoming/upcoming.eventview'
import EditEvent from './editEvent'
import { Link } from 'react-router-dom';


const EventView = (props) => {
    const { useEventById, useBusinessName } = useContext(SiteContext)
    const event = useEventById(Number(props.match.params.id))
    const venue_name = useBusinessName(event.venue_id)
    const brand_name = useBusinessName(event.brand_id)
    
    const [ isCreator, setIsCreator ] = useState(false)
    const [ modalShow, setModalShow ] = useState(false)
    
    const handleModalClose = () => setModalShow(false)
    const handleModalOpen = () => setModalShow(true)
    
    const checkMap = (e) => {
        console.log('click')
    }
    
    // check if user created event to show edit and delete options
    useEffect(() => {
        const user_id = localStorage.getItem('userId')
        if (!user_id) {
            return
        } else {
            if (event.created_by === Number(user_id)) {
                setIsCreator(true)
            } else {
                return
            }
        }
    }, [event.created_by])

    return (
        <Container className='px-0'>
            <Row className='d-flex justify-content-between'>
                <Col xs={10}>
                    <h2>{event.eventname}</h2>
                </Col>
                <Col className={`${isCreator ? 'd-flex' : 'd-none'}`}>
                    <Col>
                        <Button size='sm' variant='info'>
                            <FontAwesomeIcon onClick={handleModalOpen} icon={faEdit} />
                        </Button>
                    </Col>
                    <Col>
                        <Button size='sm' variant='danger'>
                            <FontAwesomeIcon icon={faTrash} />
                        </Button>
                    </Col>
                </Col>
            </Row>
            <Row className='mx-auto my-3'>
                <Image fluid src={event.eventmedia} alt={event.eventname} />
            </Row>
            <Row className='d-flex flex-row mx-3'>
                <Col xs={1}>
                    <FontAwesomeIcon onClick={(e) => checkMap(e)} icon={faLocationArrow} size='1x' />
                </Col>
                <Col className='fw-bold'>
                    {venue_name}
                </Col>
            </Row>
            <Row className='d-flex justify-content-end me-3 fs-4 fw-bold'>{`${formatTime(event.eventstart)} - ${formatTime(event.eventend)}`}</Row>
            <Row className='py-3 m-2 fs-4 lh-lg border-top'>
                {event.details}
            </Row>
            <Row className='py-3 m-2 fw-bold border-bottom'>
                <Link to={{
                    pathname: `/business/${event.brand_id}`
                }}>
                    {`With Brand: ${brand_name}`}
                </Link>
            </Row>
            <Row>
                <UpcomingEventView event={event.event_id}/>
            </Row>
            <Modal show={modalShow} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Event</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <EditEvent event={event} handleClose={handleModalClose}/>
                </Modal.Body>
            </Modal>
        </Container>
    )
}

export default EventView