import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { format } from 'date-fns'
import { Col, Image, ListGroup, Row } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCannabis, faClinicMedical } from '@fortawesome/free-solid-svg-icons'

import { formatTime } from '../../helpers/formatTime'

const BusinessEventListing = ({ event_list, location, business_name }) => {

    const textTruncation = (eventdetails, cutoff) => {
        return (eventdetails.length > cutoff) ? eventdetails.substr(0, cutoff - 1) + '...' : eventdetails;
    }
    
    return (
        <>
            <Row className='pt-3'>
                <h5>{`Upcoming ${business_name} events`}</h5>
            </Row>
            <ListGroup className='px-0'>
                {
                    event_list.map(event => {
                        return (
                            <ListGroup.Item key={event.event_id} className='my-1 py-1 lh-sm'>
                                <Row>
                                    <Link to={{
                                        pathname: `/event/${event.event_id}`,
                                        state: {
                                            event,
                                            from: location.pathname
                                        }
                                    }}><h4 className='mb-0 text-truncate'>{`${event.eventname.toUpperCase()}`}</h4></Link>
                                </Row>
                                <Row className='px-2 border-bottom'>
                                    <Col xs={6} className='px-0'>{format(new Date(event.eventdate), 'E, MMM do')}</Col>
                                    <Col xs={6} className='px-1 text-end'>{`${formatTime(event.eventstart)} - ${formatTime(event.eventend)}`}</Col>
                                </Row>
                                <Row>
                                    <Col xs={5} className='py-3'>
                                        <Image src={event.eventmedia} thumbnail />               
                                    </Col>
                                    <Col xs={7} className='py-2'>
                                        <Row>
                                            <Col xs={1} className='px-0'><FontAwesomeIcon icon={faClinicMedical} /></Col>
                                            <Col xs={11}>
                                                <Link to={{ pathname: `/business/${event.venue_id}` }}>
                                                    {event.venue_name}
                                                </Link>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs={1} className='px-0'><FontAwesomeIcon icon={faCannabis} /></Col>
                                            <Col xs={11}>
                                                <Link to={{ pathname: `/business/${event.brand_id}` }}>
                                                    {event.brand_name}
                                                </Link>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Link className='px-0'to={{
                                                pathname: `/event/${event.event_id}`,
                                                state: {
                                                    event,
                                                    from: location.pathname
                                                }
                                            }}>
                                                {textTruncation(event.details, 125)}
                                            </Link>
                                        </Row>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        )
                    })
                }
            </ListGroup>
        </>
    )
}

export default withRouter(BusinessEventListing);