import React from 'react';
import { Container } from 'react-bootstrap';

import EventPreview from '../events/eventPreview';
import useEventsFilter from '../../hooks/useEventsFilter';


const UpcomingBusinessView = (props) => {
    const business_events = useEventsFilter({ business_id: props.business})
    
    return (
        <Container>
            <h3>Upcoming Events</h3>
            {
                business_events.map(event => {
                    return (
                        <EventPreview key={event.event_id} event={event}/>
                    )
                })
            }
        </Container>
    )
}

export default UpcomingBusinessView;