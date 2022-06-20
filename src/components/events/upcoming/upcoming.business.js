import React from 'react';
import { Container, Row } from 'react-bootstrap';

import { useEventsQuery } from '../../../hooks/useEvents';
import EventPreview from '../eventPreview';


const UpcomingBusiness = ({ business }) => {
    const { data: events, isLoading } = useEventsQuery()

    if (isLoading) {
        return <div>loading..</div>
    }

    const business_events = events.data.filter(event => event.brand_id === business.id || event.venue_id === business.id)

    return (
        <Container className='px-0'>
            {
                (business_events.length > 0) &&
                <Row className='px-0 py-1'>
                    <h3>{`Upcoming events with ${business.business_name}`}</h3>
                </Row>
            }
            {
                business_events.map(event => {
                    return (
                        <EventPreview key={event.event_id} event={event} />
                    )
                })
            }
        </Container>
    )
}

export default UpcomingBusiness;