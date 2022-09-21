import React from 'react'
import { useParams } from 'react-router-dom';
import { Col, Image, Row } from 'react-bootstrap'
import { format } from 'date-fns'

import { formatTime } from '../../helpers/formatTime';
import { useEventQuery, useEventsQuery } from '../../hooks/useEvents';

import LoadingSpinner from '../loadingSpinner';
import EventList from './eventList';
import BusinessVenue from '../business/business_venue';
import BusinessBrand from '../business/business_brand';

const EventView = () => {
    let { event_id } = useParams()
    let brand_event_list = []
    let venue_event_list = []
    let both_event_list = []

    const { data: event, isLoading: eventLoading, isSuccess: eventSuccess } = useEventQuery(event_id)
    const { data: events, isLoading: listLoading, isSuccess: listSuccess } = useEventsQuery()

    if (eventLoading || listLoading) {
        return <LoadingSpinner />
    }

    if (eventSuccess && listSuccess) {
        brand_event_list = events.data.filter(e => e.brand_id === event.data.brand_id && e.event_id !== event.data.event_id)
        venue_event_list = events.data.filter(e => e.venue_id === event.data.venue_id && e.event_id !== event.data.event_id)
        both_event_list = events.data.filter(e => (e.venue_id === event.data.venue_id || e.brand_id === event.data.brand_id) && e.event_id !== event.data.event_id)
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
                    <BusinessVenue venue_id={event.data.venue_id} venue_name={event.data.venue_name} borderside='end' />
                    <BusinessBrand brand_id={event.data.brand_id} brand_name={event.data.brand_name} reverse />
                </Col>
            </Row>

            <Row className='px-0 mx-0 fs-6 lh-sm mt-1 pt-2 border-top'>
                {event.data.details}
            </Row>
            <Row>
                {
                    (event.data.brand_id === event.data.venue_id)
                        ? <EventList event_list={both_event_list} business_name={event.data.brand_name} />
                        : <div>
                            <EventList event_list={brand_event_list} business_name={event.data.brand_name} />
                            <EventList event_list={venue_event_list} business_name={event.data.venue_name} />
                        </div>
                }
            </Row>
        </>
    )
}

export default EventView