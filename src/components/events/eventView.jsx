import React from 'react'
import { Link } from 'react-router-dom';
import { Col, Container, Image, Row } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationArrow } from '@fortawesome/free-solid-svg-icons'

import { formatTime } from '../../helpers/formatTime';
// import { UsersContext } from '../../context/users/users.provider';
import { useEventQuery } from '../../hooks/useEvents';

import UpcomingEvents from './upcoming/upcoming.events';
// import EditEventButton from '../editButtonModals/editEventButton';

const EventView = (props) => {
    // const { userProfile } = useContext(UsersContext);
    const { data: event, isLoading } = useEventQuery(props.match.params.id)
    
    if (isLoading) {
        return <div>loading...</div>
    }

    console.log(event)
    return (
        <>
            <Row className='d-flex justify-content-between px-3'>
                <Col className='px-0'>
                    <h2>{event.data.eventname}</h2>
                    <Row className='py-0 px-0'>
                        <Link to={ {pathname: `/business/${event.data.brand_id}`} }>
                            {`featuring: ${event.data.brand_name}`}
                        </Link>
                    </Row>
                </Col>
                {/* <Col className={`${(userProfile.id === event.data.created_by) ? 'd-block p-0 m-0' : 'd-none'}`}>
                    <EditEventButton event={event} />
                </Col> */}
            </Row>
            <Row className='mx-auto my-3'>
                <Image fluid src={event.data.eventmedia} alt={event.data.eventname} />
            </Row>
            <Row className='d-flex flex-row mx-3'>
                <Col xs={1}>
                    <FontAwesomeIcon icon={faLocationArrow} size='1x' />
                </Col>
                <Col className='fw-bold'>
                    {event.data.venue_name}
                </Col>
            </Row>
            <Row className='d-flex justify-content-end me-3 fs-4 fw-bold'>{`${formatTime(event.data.eventstart)} - ${formatTime(event.data.eventend)}`}</Row>
            <Row className='py-3 m-2 fs-5 lh-base border-top'>
                {event.data.details}
            </Row>
            <Row>
                <UpcomingEvents event={event.data} venue_id={event.data.venue_id} brand_id={event.data.brand_id} />
            </Row>
        </>
    )
}

export default EventView