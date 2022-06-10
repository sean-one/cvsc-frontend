import React, { useContext } from 'react';
import { Container, Row } from 'react-bootstrap';

import { SiteContext } from '../../../context/site/site.provider';
import EventPreview from '../eventPreview';


const UpcomingBusiness = (props) => {
    const { useBusinessById, useEventsByBusiness } = useContext(SiteContext)
    const business = useBusinessById(props.business)
    const business_events = useEventsByBusiness(props.business)

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