import React from 'react'
import { Link } from 'react-router-dom';
import { Col, Image, Row } from 'react-bootstrap'
import { format } from 'date-fns'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCannabis, faClinicMedical  } from '@fortawesome/free-solid-svg-icons'

import { formatTime } from '../../helpers/formatTime';
import { useEventQuery } from '../../hooks/useEvents';

import UpcomingEvents from './upcoming/upcoming.events';

const EventView = (props) => {
    const { data: event, isLoading } = useEventQuery(props.match.params.id)
    
    if (isLoading) {
        return <div>loading...</div>
    }

    return (
        <>
            <Row className='py-0'>
                <h2>{event.data.eventname.toUpperCase()}</h2>
            </Row>
            <Row className='fw-bold'>
                <Col xs={6}>{format(new Date(event.data.eventdate), 'E, MMMM d')}</Col>
                <Col xs={6} className='text-end'>{`${formatTime(event.data.eventstart)} - ${formatTime(event.data.eventend)}`}</Col>
            </Row>
            <Row className='mx-auto my-3'>
                <Image fluid src={event.data.eventmedia} alt={event.data.eventname} />
            </Row>
            {/* brand and venue names and links */}
            <Row>
                <Col className='d-flex justify-content-center px-4'>
                    <Col xs={1}><FontAwesomeIcon icon={faClinicMedical} /></Col>
                    <Col xs={5} className='border-end'>
                        <Link to={{ pathname: `/business/${event.data.venue_id}` }}>
                            {event.data.venue_name}
                        </Link>
                    
                    </Col>
                    <Col xs={5} className='text-end'>
                        <Link to={{ pathname: `/business/${event.data.brand_id}` }}>
                            {event.data.brand_name}
                        </Link>
                    </Col>
                    <Col xs={1} className='text-end'><FontAwesomeIcon icon={faCannabis} /></Col>
                </Col>
            </Row>

            <Row className='px-0 mx-0 fs-6 lh-sm mt-1 pt-2 border-top'>
                {event.data.details}
            </Row>
            <Row>
                <UpcomingEvents event={event.data} venue_id={event.data.venue_id} brand_id={event.data.brand_id} />
            </Row>
        </>
    )
}

export default EventView